import Int "mo:core/Int";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type ExamCategory = {
    #rimc;
    #sainikSchool;
    #rms;
    #navodaya;
  };

  type Subject = {
    #math;
    #english;
    #gk;
    #reasoning;
  };

  type Question = {
    id : Nat;
    examCategory : ExamCategory;
    subject : Subject;
    topic : Text;
    question : Text;
    options : [Text];
    correctAnswer : Nat; // 0-3 range
    explanation : Text;
  };

  type MockTest = {
    id : Nat;
    title : Text;
    examCategory : ExamCategory;
    questionIds : [Nat];
    durationMinutes : Nat;
  };

  type TestAttempt = {
    principal : Principal;
    testId : Nat;
    answers : [Nat];
    score : Nat;
    total : Nat;
    timeTaken : Nat;
    timestamp : Int;
  };

  type StudyNote = {
    id : Nat;
    examCategory : ExamCategory;
    subject : Subject;
    topic : Text;
    content : Text;
  };

  type LeaderboardEntry = {
    principal : Principal;
    scorePercentage : Nat;
    total : Nat;
    testTitle : Text;
    timestamp : Int;
  };

  type UserProfile = {
    name : Text;
    examCategory : ?ExamCategory;
  };

  module LeaderboardEntry {
    public func compare(a : LeaderboardEntry, b : LeaderboardEntry) : Order.Order {
      Nat.compare(b.scorePercentage, a.scorePercentage);
    };
  };

  var nextQuestionId = 1;
  var nextMockTestId = 1;
  var nextNoteId = 1;

  let questions = Map.empty<Nat, Question>();
  let mockTests = Map.empty<Nat, MockTest>();
  let testAttempts = List.empty<TestAttempt>();
  let notes = Map.empty<Nat, StudyNote>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getQuestionsByCategoryAndSubject(cat : ExamCategory, subj : Subject) : async [Question] {
    questions.values().toArray().filter(func(q) { q.examCategory == cat and q.subject == subj });
  };

  public query ({ caller }) func getPracticeQuestions(cat : ExamCategory, subj : Subject) : async [Question] {
    questions.values().toArray().filter(func(q) { q.examCategory == cat and q.subject == subj }).sliceToArray(0,10);
  };

  public query ({ caller }) func getMockTestsByCategory(cat : ExamCategory) : async [MockTest] {
    mockTests.values().toArray().filter(func(test) { test.examCategory == cat });
  };

  public query ({ caller }) func getMockTestById(id : Nat) : async {
    test : MockTest;
    questions : [Question];
  } {
    switch (mockTests.get(id)) {
      case (null) { Runtime.trap("Test not found") };
      case (?test) {
        let qsOpt = test.questionIds.map(func(qid) { questions.get(qid) });
        if (qsOpt.any(func(opt) { opt == null })) { Runtime.trap("One or more questions not found") };
        let qs = qsOpt.map(func(opt) { opt.unwrap() });
        { test; questions = qs };
      };
    };
  };

  public shared ({ caller }) func submitTestAttempt(testId : Nat, answers : [Nat], timeTaken : Nat) : async {
    score : Nat;
    total : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit test attempts");
    };

    let test = switch (mockTests.get(testId)) {
      case (null) { Runtime.trap("Test not found") };
      case (?t) { t };
    };

    if (answers.size() != test.questionIds.size()) { Runtime.trap("Answer count mismatch") };

    let questionsOpt = test.questionIds.map(func(qid) { questions.get(qid) });
    if (questionsOpt.any(func(opt) { opt == null })) { Runtime.trap("One or more questions not found") };

    let questionsList = questionsOpt.map(func(opt) { opt.unwrap() });
    var score = 0;
    for (i in Nat.range(0, answers.size())) {
      if (answers[i] == questionsList[i].correctAnswer) { score += 1 };
    };

    let attempt : TestAttempt = {
      principal = caller;
      testId;
      answers;
      score;
      total = questionsList.size();
      timeTaken;
      timestamp = Time.now();
    };

    testAttempts.add(attempt);

    {
      score;
      total = questionsList.size();
    };
  };

  public query ({ caller }) func getUserAttempts() : async [TestAttempt] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their attempts");
    };
    testAttempts.toArray().filter(func(attempt) { attempt.principal == caller });
  };

  public query ({ caller }) func getNotesByCategoryAndSubject(cat : ExamCategory, subj : Subject) : async [StudyNote] {
    notes.values().toArray().filter(func(note) { note.examCategory == cat and note.subject == subj });
  };

  public query ({ caller }) func getLeaderboardByCategory(cat : ExamCategory) : async [LeaderboardEntry] {
    let categoryTestIds = mockTests.values().toArray().filter(func(test) { test.examCategory == cat }).map(func(test) { test.id });
    let categoryAttempts = testAttempts.toArray().filter(func(attempt) {
      categoryTestIds.any(func(id) { id == attempt.testId });
    });

    let entries = categoryAttempts.map(func(attempt) {
      let test = switch (mockTests.get(attempt.testId)) {
        case (null) { Runtime.trap("Test not found") };
        case (?t) { t };
      };
      {
        principal = attempt.principal;
        scorePercentage = attempt.score * 100 / attempt.total;
        total = attempt.total;
        testTitle = test.title;
        timestamp = attempt.timestamp;
      };
    });

    entries.sort().sliceToArray(0, 20);
  };

  public shared ({ caller }) func addQuestion(examCategory : ExamCategory, subject : Subject, topic : Text, question : Text, options : [Text], correctAnswer : Nat, explanation : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add questions");
    };
    let q : Question = {
      id = nextQuestionId;
      examCategory;
      subject;
      topic;
      question;
      options;
      correctAnswer;
      explanation;
    };
    questions.add(nextQuestionId, q);
    nextQuestionId += 1;
  };

  public shared ({ caller }) func createMockTest(title : Text, examCategory : ExamCategory, questionIds : [Nat], durationMinutes : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create tests");
    };
    let test : MockTest = {
      id = nextMockTestId;
      title;
      examCategory;
      questionIds;
      durationMinutes;
    };
    mockTests.add(nextMockTestId, test);
    nextMockTestId += 1;
  };

  public shared ({ caller }) func addStudyNote(examCategory : ExamCategory, subject : Subject, topic : Text, content : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add notes");
    };
    let note : StudyNote = {
      id = nextNoteId;
      examCategory;
      subject;
      topic;
      content;
    };
    notes.add(nextNoteId, note);
    nextNoteId += 1;
  };
};
