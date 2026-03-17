import Int "mo:core/Int";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import OutCall "http-outcalls/outcall";
import Stripe "stripe/stripe";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // ---------- Types ----------
  public type ExamCategory = { #rimc; #sainikSchool; #rms; #navodaya };
  public type Subject = { #math; #english; #gk; #reasoning };

  public type Question = {
    id : Nat;
    examCategory : ExamCategory;
    subject : Subject;
    topic : Text;
    question : Text;
    options : [Text];
    correctAnswer : Nat; // 0-3 range
    explanation : Text;
  };

  public type PracticeQuestion = {
    id : Nat;
    examCategory : ExamCategory;
    subject : Subject;
    topic : Text;
    question : Text;
    options : [Text];
    correctAnswer : Nat;
    explanation : Text;
  };

  public type MockTest = {
    id : Nat;
    title : Text;
    examCategory : ExamCategory;
    questionIds : [Nat];
    durationMinutes : Nat;
  };

  public type TestAttempt = {
    principal : Principal;
    testId : Nat;
    answers : [Nat];
    score : Nat;
    total : Nat;
    timeTaken : Nat;
    timestamp : Int;
  };

  public type StudyNote = {
    id : Nat;
    examCategory : ExamCategory;
    subject : Subject;
    topic : Text;
    content : Text;
  };

  public type LeaderboardEntry = {
    principal : Principal;
    scorePercentage : Nat;
    total : Nat;
    testTitle : Text;
    timestamp : Int;
  };

  public type UserProfile = {
    name : Text;
    examCategory : ?ExamCategory;
  };

  module LeaderboardEntry {
    public func compare(a : LeaderboardEntry, b : LeaderboardEntry) : Order.Order {
      Nat.compare(b.scorePercentage, a.scorePercentage);
    };
  };

  public type QuestionInput = {
    examCategory : ExamCategory;
    subject : Subject;
    topic : Text;
    question : Text;
    options : [Text];
    correctAnswer : Nat;
    explanation : Text;
  };

  public type StudyNoteInput = {
    examCategory : ExamCategory;
    subject : Subject;
    topic : Text;
    content : Text;
  };

  public type TestSubmissionResult = {
    score : Nat;
    total : Nat;
    percentage : Nat;
    timeTaken : Nat;
  };

  // ---------- State ----------
  let questions = Map.empty<Nat, Question>();
  let mockTests = Map.empty<Nat, MockTest>();
  let notes = Map.empty<Nat, StudyNote>();
  let testAttempts = List.empty<TestAttempt>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextQuestionId = 1;
  var nextMockTestId = 1;
  var nextNoteId = 1;

  // Stripe config
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  // Razorpay config
  var razorpayKeyId : ?Text = null;

  // Access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ---------- Seed Data Helper Functions ----------
  private func seedQuestion(
    id : Nat,
    examCategory : ExamCategory,
    subject : Subject,
    topic : Text,
    question : Text,
    options : [Text],
    correctAnswer : Nat,
    explanation : Text,
  ) {
    let q : Question = {
      id;
      examCategory;
      subject;
      topic;
      question;
      options;
      correctAnswer;
      explanation;
    };
    questions.add(id, q);
  };

  private func seedNote(
    id : Nat,
    examCategory : ExamCategory,
    subject : Subject,
    topic : Text,
    content : Text,
  ) {
    let note : StudyNote = {
      id;
      examCategory;
      subject;
      topic;
      content;
    };
    notes.add(id, note);
  };

  private func seedMockTest(
    id : Nat,
    title : Text,
    examCategory : ExamCategory,
    questionIds : [Nat],
    durationMinutes : Nat,
  ) {
    let test : MockTest = {
      id;
      title;
      examCategory;
      questionIds;
      durationMinutes;
    };
    mockTests.add(id, test);
  };

  // ---------- Initialize Seed Data ----------
  // RIMC MATH (10 questions, IDs 1-10)
  seedQuestion(1, #rimc, #math, "Number System", "What is the value of 25 × 24?", ["500", "600", "625", "650"], 1, "25 × 24 = 500 + 100 = 600");
  seedQuestion(2, #rimc, #math, "Fractions", "What is 3/4 + 1/6?", ["4/10", "11/12", "5/12", "7/10"], 1, "LCM of 4 and 6 is 12. 3/4=9/12, 1/6=2/12. Sum=11/12");
  seedQuestion(3, #rimc, #math, "Percentages", "A student scored 72 out of 90. What is the percentage?", ["78%", "80%", "82%", "84%"], 1, "Percentage = (72/90) x 100 = 80%");
  seedQuestion(4, #rimc, #math, "Simple Interest", "Find the simple interest on Rs 1000 at 5% per annum for 2 years.", ["Rs 50", "Rs 100", "Rs 150", "Rs 200"], 1, "SI = PRT/100 = 1000x5x2/100 = Rs 100");
  seedQuestion(5, #rimc, #math, "Geometry", "What is the area of a rectangle with length 8 cm and breadth 5 cm?", ["30 sq cm", "40 sq cm", "45 sq cm", "50 sq cm"], 1, "Area = length x breadth = 8 x 5 = 40 sq cm");
  seedQuestion(6, #rimc, #math, "Average", "The average of 5 numbers is 20. If one number is 30, what is the average of the remaining 4?", ["15", "17.5", "18", "20"], 1, "Sum = 100. Remaining = 70. Average = 70/4 = 17.5");
  seedQuestion(7, #rimc, #math, "Ratio and Proportion", "Divide 60 in ratio 2:3.", ["20 and 40", "24 and 36", "30 and 30", "25 and 35"], 1, "First = 24, Second = 36");
  seedQuestion(8, #rimc, #math, "Time and Work", "If A can do work in 10 days and B in 15 days, how many days together?", ["5 days", "6 days", "7 days", "8 days"], 1, "1/10+1/15=5/30=1/6. Together = 6 days");
  seedQuestion(9, #rimc, #math, "Number System", "What is LCM of 12 and 18?", ["24", "36", "48", "72"], 1, "LCM = 36");
  seedQuestion(10, #rimc, #math, "Squares and Cubes", "What is the square root of 144?", ["11", "12", "13", "14"], 1, "12 x 12 = 144");

  // RIMC ENGLISH (10 questions, IDs 11-20)
  seedQuestion(11, #rimc, #english, "Grammar", "Choose the correct sentence:", ["She don't like mangoes", "She doesn't likes mangoes", "She doesn't like mangoes", "She not like mangoes"], 2, "With she, use doesn't and base verb");
  seedQuestion(12, #rimc, #english, "Vocabulary", "What is the antonym of brave?", ["Bold", "Coward", "Strong", "Smart"], 1, "Antonym of brave is coward");
  seedQuestion(13, #rimc, #english, "Comprehension", "The word gigantic means:", ["Very small", "Very large", "Very fast", "Very slow"], 1, "Gigantic means extremely large");
  seedQuestion(14, #rimc, #english, "Grammar", "He ___ to school every day.", ["go", "goes", "going", "gone"], 1, "Third person singular uses goes");
  seedQuestion(15, #rimc, #english, "Vocabulary", "Find the synonym of happy:", ["Sad", "Angry", "Joyful", "Tired"], 2, "Joyful is a synonym of happy");
  seedQuestion(16, #rimc, #english, "Grammar", "Which is the correct plural of child?", ["Childs", "Childes", "Children", "Childrens"], 2, "Irregular plural of child is children");
  seedQuestion(17, #rimc, #english, "Tenses", "She ___ a book yesterday.", ["reads", "read", "reading", "has read"], 1, "Yesterday = past tense. Past of read is read");
  seedQuestion(18, #rimc, #english, "Vocabulary", "The opposite of ancient is:", ["Old", "Modern", "Historical", "Ruined"], 1, "Ancient means old; opposite is modern");
  seedQuestion(19, #rimc, #english, "Grammar", "Choose the correct article: ___ elephant is a large animal.", ["A", "An", "The", "No article"], 1, "Use An before vowel sound. Elephant starts with e");
  seedQuestion(20, #rimc, #english, "Comprehension", "What does perseverance mean?", ["Giving up easily", "Continued effort despite difficulties", "Quick success", "Natural talent"], 1, "Perseverance = continuing despite difficulty");

  // RIMC GK (10 questions, IDs 21-30)
  seedQuestion(21, #rimc, #gk, "Indian History", "Who is known as the Father of the Nation of India?", ["Jawaharlal Nehru", "Sardar Patel", "Mahatma Gandhi", "Subhas Chandra Bose"], 2, "Mahatma Gandhi is Father of the Nation");
  seedQuestion(22, #rimc, #gk, "Geography", "Which is the longest river in India?", ["Yamuna", "Brahmaputra", "Ganga", "Godavari"], 2, "Ganga is longest river at 2525 km");
  seedQuestion(23, #rimc, #gk, "Indian Army", "RIMC stands for:", ["Rashtriya Indian Military College", "Royal Indian Military College", "Rashtriya Indian Militia Corps", "Royal Indian Militia College"], 0, "RIMC = Rashtriya Indian Military College, Dehradun");
  seedQuestion(24, #rimc, #gk, "Science", "What is the chemical formula of water?", ["CO2", "H2O", "O2", "NaCl"], 1, "Water = H2O (2 hydrogen, 1 oxygen)");
  seedQuestion(25, #rimc, #gk, "Indian Army", "The motto of the Indian Army is:", ["Jai Hind", "Service Before Self", "Balidan", "Sarvada Shaktishali"], 1, "Motto is Service Before Self");
  seedQuestion(26, #rimc, #gk, "Geography", "Which is the capital of India?", ["Mumbai", "Kolkata", "New Delhi", "Chennai"], 2, "New Delhi is the capital of India");
  seedQuestion(27, #rimc, #gk, "Science", "How many bones in adult human body?", ["196", "206", "216", "226"], 1, "Adult human body has 206 bones");
  seedQuestion(28, #rimc, #gk, "Indian History", "In which year did India get independence?", ["1945", "1946", "1947", "1948"], 2, "India got independence on 15 August 1947");
  seedQuestion(29, #rimc, #gk, "Awards", "The highest civilian award in India is:", ["Padma Bhushan", "Padma Shri", "Bharat Ratna", "Padma Vibhushan"], 2, "Bharat Ratna is highest civilian honour");
  seedQuestion(30, #rimc, #gk, "Indian Army", "Which is the oldest regiment of Indian Army?", ["Punjab Regiment", "Madras Regiment", "Bengal Regiment", "Rajput Regiment"], 1, "Madras Regiment is oldest, raised in 1758");

  // RIMC REASONING (10 questions, IDs 31-40)
  seedQuestion(31, #rimc, #reasoning, "Series", "Complete: 2, 4, 8, 16, ___", ["24", "28", "32", "36"], 2, "Each doubles: 16x2=32");
  seedQuestion(32, #rimc, #reasoning, "Analogy", "Book : Library :: Painting : ___", ["School", "Museum", "Hospital", "Market"], 1, "Books in Library; Paintings in Museum");
  seedQuestion(33, #rimc, #reasoning, "Odd One Out", "Which is odd: Apple, Mango, Carrot, Banana", ["Apple", "Mango", "Carrot", "Banana"], 2, "Carrot is vegetable; others are fruits");
  seedQuestion(34, #rimc, #reasoning, "Direction", "A man walks 5 km North then 3 km East. How far from start?", ["8 km", "Root 34 km", "4 km", "6 km"], 1, "Pythagoras: root(25+9) = root 34");
  seedQuestion(35, #rimc, #reasoning, "Series", "What comes next: Z, Y, X, W, ___?", ["U", "V", "T", "S"], 1, "Reverse alphabet: after W comes V");
  seedQuestion(36, #rimc, #reasoning, "Blood Relations", "A is father of B. B is brother of C. How is A related to C?", ["Uncle", "Brother", "Father", "Grandfather"], 2, "A is father of B, B is brother of C, so A is father of C");
  seedQuestion(37, #rimc, #reasoning, "Mirror Image", "Mirror image of PAPER is:", ["REPAP", "PAPAR", "REPPA", "PRAEP"], 0, "Mirror reverses: PAPER = REPAP");
  seedQuestion(38, #rimc, #reasoning, "Number Series", "3, 6, 11, 18, 27, ___", ["36", "38", "39", "40"], 1, "Differences 3,5,7,9,11: next = 27+11=38");
  seedQuestion(39, #rimc, #reasoning, "Analogy", "Sun : Day :: Moon : ___", ["Light", "Night", "Star", "Sky"], 1, "Sun seen in day; Moon seen in night");
  seedQuestion(40, #rimc, #reasoning, "Coding-Decoding", "If CAT = 24, what is DOG?", ["26", "27", "28", "29"], 0, "C=3,A=1,T=20=24. D=4,O=15,G=7=26");

  // SAINIK SCHOOL MATH (10 questions, IDs 41-50)
  seedQuestion(41, #sainikSchool, #math, "Arithmetic", "What is 15% of 200?", ["25", "30", "35", "40"], 1, "15% of 200 = 30");
  seedQuestion(42, #sainikSchool, #math, "Number System", "What is HCF of 24 and 36?", ["6", "8", "12", "18"], 2, "HCF = 12");
  seedQuestion(43, #sainikSchool, #math, "Geometry", "Perimeter of square with side 7 cm?", ["21 cm", "28 cm", "35 cm", "49 cm"], 1, "4 x 7 = 28 cm");
  seedQuestion(44, #sainikSchool, #math, "Fractions", "Which is greater: 3/5 or 4/7?", ["3/5", "4/7", "Both equal", "Cannot determine"], 0, "21/35 > 20/35, so 3/5 > 4/7");
  seedQuestion(45, #sainikSchool, #math, "Profit and Loss", "Bought Rs 80, sold Rs 100. Profit percent?", ["20%", "25%", "30%", "35%"], 1, "Profit=20, Profit%=25%");
  seedQuestion(46, #sainikSchool, #math, "Speed", "Car travels 120 km in 2 hours. Speed?", ["50 km/h", "55 km/h", "60 km/h", "65 km/h"], 2, "Speed=120/2=60 km/h");
  seedQuestion(47, #sainikSchool, #math, "Algebra", "If x + 5 = 12, then x = ?", ["5", "6", "7", "8"], 2, "x=12-5=7");
  seedQuestion(48, #sainikSchool, #math, "Area", "Area of triangle with base 10 cm and height 6 cm?", ["30 sq cm", "60 sq cm", "45 sq cm", "20 sq cm"], 0, "(1/2)x10x6=30");
  seedQuestion(49, #sainikSchool, #math, "Number System", "Smallest 4-digit number?", ["999", "1000", "1001", "1010"], 1, "Smallest 4-digit = 1000");
  seedQuestion(50, #sainikSchool, #math, "Decimals", "0.5 + 0.25 = ?", ["0.70", "0.75", "0.80", "0.85"], 1, "0.75");

  // SAINIK SCHOOL ENGLISH (10 questions, IDs 51-60)
  seedQuestion(51, #sainikSchool, #english, "Vocabulary", "Meaning of enormous:", ["Very small", "Very fast", "Very large", "Very quiet"], 2, "Enormous = very large");
  seedQuestion(52, #sainikSchool, #english, "Grammar", "Plural of tooth is:", ["Tooths", "Teeth", "Toothes", "Teeths"], 1, "Irregular plural: teeth");
  seedQuestion(53, #sainikSchool, #english, "Grammar", "Correct past tense sentence?", ["He runned fast", "He ran fast", "He ranned fast", "He runs fast"], 1, "Past of run is ran");
  seedQuestion(54, #sainikSchool, #english, "Comprehension", "Patriotic means:", ["Loving ones country", "Being selfish", "Being fearful", "Being lazy"], 0, "Patriotic = loving your country");
  seedQuestion(55, #sainikSchool, #english, "Vocabulary", "Synonym of difficult:", ["Easy", "Hard", "Simple", "Clear"], 1, "Hard is synonym of difficult");
  seedQuestion(56, #sainikSchool, #english, "Grammar", "___ you help me?", ["Can", "Is", "Am", "Are"], 0, "Can you help me? is correct");
  seedQuestion(57, #sainikSchool, #english, "Spelling", "Correctly spelled word:", ["Recieve", "Receeve", "Receive", "Recive"], 2, "Correct: Receive");
  seedQuestion(58, #sainikSchool, #english, "Grammar", "Comparative of good is:", ["Gooder", "More good", "Better", "Best"], 2, "Good-Better-Best");
  seedQuestion(59, #sainikSchool, #english, "Vocabulary", "Antonym of victory:", ["Win", "Success", "Defeat", "Glory"], 2, "Antonym of victory is defeat");
  seedQuestion(60, #sainikSchool, #english, "Grammar", "Book is ___ the table.", ["at", "in", "on", "above"], 2, "On the table is correct");

  // SAINIK SCHOOL GK (10 questions, IDs 61-70)
  seedQuestion(61, #sainikSchool, #gk, "Indian Army", "Sainik Schools administered by:", ["Ministry of Home Affairs", "Ministry of Defence", "Ministry of Education", "Ministry of Finance"], 1, "Ministry of Defence");
  seedQuestion(62, #sainikSchool, #gk, "Geography", "Ocean to the west of India?", ["Pacific Ocean", "Indian Ocean", "Arabian Sea", "Bay of Bengal"], 2, "Arabian Sea is to the west");
  seedQuestion(63, #sainikSchool, #gk, "Science", "Plants make food through:", ["Respiration", "Transpiration", "Photosynthesis", "Germination"], 2, "Photosynthesis");
  seedQuestion(64, #sainikSchool, #gk, "Sports", "Arjuna Award is for:", ["Science", "Sports", "Arts", "Social Service"], 1, "For excellence in sports");
  seedQuestion(65, #sainikSchool, #gk, "Indian History", "First Prime Minister of India:", ["Sardar Patel", "B.R. Ambedkar", "Jawaharlal Nehru", "Rajendra Prasad"], 2, "Jawaharlal Nehru (1947-1964)");
  seedQuestion(66, #sainikSchool, #gk, "Current Affairs", "National animal of India:", ["Lion", "Tiger", "Elephant", "Peacock"], 1, "Bengal Tiger");
  seedQuestion(67, #sainikSchool, #gk, "Science", "Planet closest to Sun:", ["Venus", "Earth", "Mercury", "Mars"], 2, "Mercury");
  seedQuestion(68, #sainikSchool, #gk, "Indian Army", "NDA stands for:", ["National Defence Army", "National Defence Academy", "Naval Defence Academy", "National Drill Academy"], 1, "National Defence Academy, Pune");
  seedQuestion(69, #sainikSchool, #gk, "Geography", "Himalayas lie in which direction?", ["South", "East", "West", "North"], 3, "Himalayas are to the North of India");
  seedQuestion(70, #sainikSchool, #gk, "Indian History", "Who wrote national anthem?", ["Rabindranath Tagore", "Bankim Chandra", "Mahatma Gandhi", "Subhas Chandra Bose"], 0, "Jana Gana Mana by Rabindranath Tagore");

  // SAINIK SCHOOL REASONING (10 questions, IDs 71-80)
  seedQuestion(71, #sainikSchool, #reasoning, "Series", "1, 1, 2, 3, 5, 8, ___", ["11", "12", "13", "14"], 2, "Fibonacci: 5+8=13");
  seedQuestion(72, #sainikSchool, #reasoning, "Analogy", "Doctor : Hospital :: Teacher : ___", ["Market", "School", "Factory", "Farm"], 1, "Teacher works in school");
  seedQuestion(73, #sainikSchool, #reasoning, "Classification", "Does NOT belong: Dog, Cat, Cow, Eagle?", ["Dog", "Cat", "Cow", "Eagle"], 3, "Eagle is bird; others are mammals");
  seedQuestion(74, #sainikSchool, #reasoning, "Directions", "Face North, turn 90 degrees clockwise, now face:", ["North", "South", "East", "West"], 2, "North + 90 clockwise = East");
  seedQuestion(75, #sainikSchool, #reasoning, "Number Pattern", "10, 20, 30, 40, ___?", ["45", "48", "50", "55"], 2, "Add 10 each time: 50");
  seedQuestion(76, #sainikSchool, #reasoning, "Letter Series", "A, C, E, G, ___", ["H", "I", "J", "K"], 1, "Alternate letters: I");
  seedQuestion(77, #sainikSchool, #reasoning, "Analogy", "Circle : Round :: Square : ___", ["Oval", "Rectangular", "Triangular", "Angular"], 3, "Square has angular shape");
  seedQuestion(78, #sainikSchool, #reasoning, "Odd One Out", "Rose, Lily, Jasmine, Mango", ["Rose", "Lily", "Jasmine", "Mango"], 3, "Mango is fruit; others are flowers");
  seedQuestion(79, #sainikSchool, #reasoning, "Arrangement", "How many months have 31 days?", ["5", "6", "7", "8"], 2, "Jan,Mar,May,Jul,Aug,Oct,Dec = 7 months");
  seedQuestion(80, #sainikSchool, #reasoning, "Analogy", "Pen : Write :: Knife : ___", ["Cut", "Draw", "Paint", "Read"], 0, "Pen is used to write; Knife is used to cut");

  // RMS MATH (10 questions, IDs 81-90)
  seedQuestion(81, #rms, #math, "Algebra", "Solve for x: 2x - 4 = 10", ["5", "6", "7", "8"], 2, "2x=14, x=7");
  seedQuestion(82, #rms, #math, "Geometry", "Sum of all angles in triangle?", ["90 degrees", "180 degrees", "270 degrees", "360 degrees"], 1, "Sum = 180 degrees");
  seedQuestion(83, #rms, #math, "Statistics", "Average of 10, 20, 30, 40, 50?", ["25", "30", "35", "40"], 1, "150/5=30");
  seedQuestion(84, #rms, #math, "Profit and Loss", "CP Rs 500, SP Rs 450. Loss percent?", ["5%", "10%", "15%", "20%"], 1, "Loss=50, Loss%=10%");
  seedQuestion(85, #rms, #math, "Mensuration", "Circumference of circle radius 7 cm (pi=22/7)?", ["44 cm", "48 cm", "52 cm", "56 cm"], 0, "2 x 22/7 x 7 = 44 cm");
  seedQuestion(86, #rms, #math, "Number Theory", "Which is prime?", ["15", "21", "29", "35"], 2, "29 is prime");
  seedQuestion(87, #rms, #math, "Time and Distance", "Train 300 km in 5 hours. Speed?", ["55 km/h", "60 km/h", "65 km/h", "70 km/h"], 1, "300/5=60 km/h");
  seedQuestion(88, #rms, #math, "Ratio", "40 students, boys:girls = 3:2. Number of girls?", ["12", "14", "16", "18"], 2, "(2/5)x40=16");
  seedQuestion(89, #rms, #math, "Powers", "What is 2 to the power 8?", ["128", "256", "512", "1024"], 1, "2^8=256");
  seedQuestion(90, #rms, #math, "Compound Interest", "CI on Rs 1000 at 10% for 2 years?", ["Rs 200", "Rs 210", "Rs 220", "Rs 230"], 1, "1000x1.1^2-1000=Rs 210");

  // RMS ENGLISH (10 questions, IDs 91-100)
  seedQuestion(91, #rms, #english, "Grammar", "Identify noun: The brave soldier fought for his country.", ["brave", "soldier", "fought", "for"], 1, "Soldier is the noun (person)");
  seedQuestion(92, #rms, #english, "Vocabulary", "Valour means:", ["Weakness", "Bravery", "Cleverness", "Honesty"], 1, "Valour = great courage");
  seedQuestion(93, #rms, #english, "Grammar", "Passive voice of He writes a letter:", ["A letter was written by him", "A letter is written by him", "A letter has been written by him", "A letter will be written by him"], 1, "Present passive: is written");
  seedQuestion(94, #rms, #english, "Vocabulary", "Word meaning to give up a position:", ["Retain", "Abdicate", "Acquire", "Maintain"], 1, "Abdicate = give up position");
  seedQuestion(95, #rms, #english, "Vocabulary", "Antonym of transparent:", ["Clear", "Visible", "Opaque", "Bright"], 2, "Opaque is opposite of transparent");
  seedQuestion(96, #rms, #english, "Idioms", "Burning midnight oil means:", ["Wasting time", "Working late at night", "Lighting lamps", "Being lazy"], 1, "Working or studying late at night");
  seedQuestion(97, #rms, #english, "Grammar", "Correct sentence about news:", ["The news are good", "The news is good", "The news were good", "The news am good"], 1, "News takes singular verb");
  seedQuestion(98, #rms, #english, "Vocabulary", "Diligent means:", ["Lazy", "Careless", "Hardworking", "Dishonest"], 2, "Diligent = hardworking");
  seedQuestion(99, #rms, #english, "Grammar", "I have been waiting ___ two hours.", ["since", "from", "for", "during"], 2, "Use for with period of time");
  seedQuestion(100, #rms, #english, "Grammar", "Choose correct: Neither Ram nor Shyam ___ present.", ["are", "is", "were", "was"], 1, "Verb agrees with nearest subject");

  // RMS GK (10 questions, IDs 101-110)
  seedQuestion(101, #rms, #gk, "Indian Army", "RMS stands for:", ["Rashtriya Military School", "Royal Military School", "Rajasthan Military School", "Regular Military Service"], 0, "RMS = Rashtriya Military Schools");
  seedQuestion(102, #rms, #gk, "Defence", "Rank above Lieutenant in Indian Army:", ["Captain", "Major", "Colonel", "Brigadier"], 0, "Lieutenant - Captain - Major");
  seedQuestion(103, #rms, #gk, "Science", "Speed of light is approximately:", ["3x10 power 6 m/s", "3x10 power 8 m/s", "3x10 power 10 m/s", "3x10 power 12 m/s"], 1, "Speed of light = 3x10^8 m/s");
  seedQuestion(104, #rms, #gk, "Indian History", "Battle of Plassey was fought in:", ["1757", "1761", "1764", "1775"], 0, "Battle of Plassey 1757");
  seedQuestion(105, #rms, #gk, "Geography", "Land of Five Rivers:", ["Haryana", "Uttar Pradesh", "Punjab", "Rajasthan"], 2, "Punjab = Land of Five Rivers");
  seedQuestion(106, #rms, #gk, "Sports", "Players in cricket team:", ["9", "10", "11", "12"], 2, "11 players in cricket");
  seedQuestion(107, #rms, #gk, "Science", "DNA stands for:", ["Deoxyribose Nucleic Acid", "Deoxyribonucleic Acid", "Diribonucleic Acid", "Deoxynucleic Acid"], 1, "DNA = Deoxyribonucleic Acid");
  seedQuestion(108, #rms, #gk, "Indian Constitution", "Fundamental rights in Indian Constitution:", ["5", "6", "7", "8"], 1, "6 fundamental rights");
  seedQuestion(109, #rms, #gk, "Geography", "Mount Everest is in:", ["India", "China", "Nepal", "Bhutan"], 2, "Mt Everest peak is in Nepal");
  seedQuestion(110, #rms, #gk, "Science", "Unit of electric current:", ["Volt", "Watt", "Ampere", "Ohm"], 2, "Ampere is unit of electric current");

  // RMS REASONING (10 questions, IDs 111-120)
  seedQuestion(111, #rms, #reasoning, "Logical Reasoning", "All cats are animals. All animals have hearts. Therefore:", ["All hearts are cats", "All cats have hearts", "Some animals not cats", "Some hearts are animals"], 1, "Cats are animals, animals have hearts, so cats have hearts");
  seedQuestion(112, #rms, #reasoning, "Series", "4, 9, 16, 25, 36, ___", ["42", "45", "49", "52"], 2, "Perfect squares: 7^2=49");
  seedQuestion(113, #rms, #reasoning, "Coding", "ARMY coded as BSNZ. NAVY coded as:", ["OBWZ", "OCWZ", "OBXZ", "OCXZ"], 0, "Each letter +1: N->O,A->B,V->W,Y->Z = OBWZ");
  seedQuestion(114, #rms, #reasoning, "Direction", "Ravi walks 2km North, 3km East, 2km South. Distance from home?", ["1 km", "2 km", "3 km", "4 km"], 2, "North-South cancel. Only 3km East remains.");
  seedQuestion(115, #rms, #reasoning, "Ranking", "Arjun is 10th from top and 20th from bottom. Total students?", ["28", "29", "30", "31"], 1, "10+20-1=29");
  seedQuestion(116, #rms, #reasoning, "Matrix", "Pattern 3,6,9; 4,8,12; 5,10,___", ["13", "14", "15", "16"], 2, "5x3=15");
  seedQuestion(117, #rms, #reasoning, "Analogy", "Soldier : War :: Doctor : ___", ["Hospital", "Nurse", "Disease", "Medicine"], 2, "Soldier fights war; Doctor fights disease");
  seedQuestion(118, #rms, #reasoning, "Number Puzzle", "If today is Wednesday, day after 100 days?", ["Friday", "Saturday", "Sunday", "Monday"], 0, "100=14x7+2. Wednesday+2=Friday");
  seedQuestion(119, #rms, #reasoning, "Series", "BDFH, JLNP, RTVX, ___", ["ZABC", "ZCDE", "ZBDF", "ZACE"], 1, "Next group starts at Z: ZCDE");
  seedQuestion(120, #rms, #reasoning, "Sequence", "64, 32, 16, 8, ___", ["6", "4", "3", "2"], 1, "Divide by 2 each time: 4");

  // NAVODAYA MATH (10 questions, IDs 121-130)
  seedQuestion(121, #navodaya, #math, "Number System", "Expanded form of 507:", ["500+70+7", "500+0+7", "50+07", "5+0+7"], 1, "507 = 500+0+7");
  seedQuestion(122, #navodaya, #math, "Fractions", "What fraction of a day is 6 hours?", ["1/6", "1/5", "1/4", "1/3"], 2, "6/24=1/4");
  seedQuestion(123, #navodaya, #math, "Mensuration", "Volume of cube with side 4 cm?", ["16 cu cm", "32 cu cm", "64 cu cm", "48 cu cm"], 2, "4x4x4=64");
  seedQuestion(124, #navodaya, #math, "Arithmetic", "A dozen pencils cost Rs 36. Cost of 5 pencils?", ["Rs 12", "Rs 15", "Rs 18", "Rs 20"], 1, "1 pencil=Rs 3, 5 pencils=Rs 15");
  seedQuestion(125, #navodaya, #math, "Shapes", "How many sides does a hexagon have?", ["4", "5", "6", "8"], 2, "Hexagon has 6 sides");
  seedQuestion(126, #navodaya, #math, "Time", "How many seconds in 1 hour?", ["360", "600", "3600", "6000"], 2, "60x60=3600 seconds");
  seedQuestion(127, #navodaya, #math, "Patterns", "5, 10, 20, 40, ___", ["60", "70", "80", "100"], 2, "Multiply by 2: 40x2=80");
  seedQuestion(128, #navodaya, #math, "Money", "Rs 500, buys bag for Rs 350. Money left?", ["Rs 100", "Rs 150", "Rs 200", "Rs 250"], 1, "500-350=Rs 150");
  seedQuestion(129, #navodaya, #math, "Symmetry", "Lines of symmetry in a circle?", ["1", "4", "8", "Infinite"], 3, "Circle has infinite lines of symmetry");
  seedQuestion(130, #navodaya, #math, "Basic Operations", "Remainder when 47 divided by 5?", ["1", "2", "3", "4"], 1, "47=9x5+2, remainder=2");

  // NAVODAYA ENGLISH (10 questions, IDs 131-140)
  seedQuestion(131, #navodaya, #english, "Grammar", "I ___ my homework yesterday.", ["do", "does", "did", "done"], 2, "Yesterday = past: did");
  seedQuestion(132, #navodaya, #english, "Vocabulary", "Meaning of swift:", ["Slow", "Fast", "Loud", "Bright"], 1, "Swift = fast");
  seedQuestion(133, #navodaya, #english, "Grammar", "Which word is adjective: The tall boy ran quickly.", ["boy", "ran", "tall", "quickly"], 2, "Tall describes boy = adjective");
  seedQuestion(134, #navodaya, #english, "Comprehension", "Migrate most nearly means:", ["Stay in one place", "Move from one place to another", "Build a nest", "Sing songs"], 1, "Migrate = move from one place to another");
  seedQuestion(135, #navodaya, #english, "Grammar", "Bird is flying ___ the tree.", ["under", "above", "between", "beside"], 1, "Flying above the tree");
  seedQuestion(136, #navodaya, #english, "Vocabulary", "Synonyms set:", ["Big-Large", "Hot-Cold", "Day-Night", "Up-Down"], 0, "Big and Large are synonyms");
  seedQuestion(137, #navodaya, #english, "Grammar", "___ he studies hard, he will pass.", ["If", "But", "So", "Or"], 0, "If is used for condition");
  seedQuestion(138, #navodaya, #english, "Spelling", "Correct spelling:", ["Beleive", "Believe", "Belive", "Beileve"], 1, "Correct: Believe");
  seedQuestion(139, #navodaya, #english, "Grammar", "Which is a question?", ["Come here.", "She is happy.", "Are you coming?", "Let us go."], 2, "Are you coming? is a question");
  seedQuestion(140, #navodaya, #english, "Vocabulary", "Nocturnal animals are:", ["Live in water", "Fly in sky", "Active at night", "Live in groups"], 2, "Nocturnal = active at night");

  // NAVODAYA GK (10 questions, IDs 141-150)
  seedQuestion(141, #navodaya, #gk, "Indian History", "Navodaya Vidyalaya started under which PM?", ["Indira Gandhi", "Rajiv Gandhi", "Atal Bihari Vajpayee", "Manmohan Singh"], 1, "Rajiv Gandhi launched JNV scheme in 1986");
  seedQuestion(142, #navodaya, #gk, "Science", "Red Planet is:", ["Venus", "Jupiter", "Mars", "Saturn"], 2, "Mars = Red Planet");
  seedQuestion(143, #navodaya, #gk, "Geography", "Largest continent?", ["Africa", "Asia", "Europe", "North America"], 1, "Asia is largest continent");
  seedQuestion(144, #navodaya, #gk, "Science", "Animals that eat only plants:", ["Carnivores", "Omnivores", "Herbivores", "Insectivores"], 2, "Herbivores eat only plants");
  seedQuestion(145, #navodaya, #gk, "Indian Culture", "Diwali is festival of:", ["Colors", "Lights", "Water", "Harvest"], 1, "Diwali = festival of lights");
  seedQuestion(146, #navodaya, #gk, "Science", "Gas we breathe in?", ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"], 2, "We breathe in oxygen");
  seedQuestion(147, #navodaya, #gk, "Geography", "Smallest state of India by area?", ["Sikkim", "Goa", "Tripura", "Manipur"], 1, "Goa is smallest state by area");
  seedQuestion(148, #navodaya, #gk, "Sports", "Players in football team?", ["9", "10", "11", "12"], 2, "11 players in football");
  seedQuestion(149, #navodaya, #gk, "Indian History", "Who invented telephone?", ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "James Watt"], 1, "Alexander Graham Bell invented telephone in 1876");
  seedQuestion(150, #navodaya, #gk, "Environment", "Non-renewable resource:", ["Solar energy", "Wind energy", "Coal", "Water"], 2, "Coal is non-renewable");

  // NAVODAYA REASONING (10 questions, IDs 151-160)
  seedQuestion(151, #navodaya, #reasoning, "Pattern", "Odd one out: 4, 9, 16, 20, 25", ["4", "9", "20", "25"], 2, "20 is not a perfect square");
  seedQuestion(152, #navodaya, #reasoning, "Analogy", "Fish : Water :: Bird : ___", ["Sky", "Air", "Land", "Tree"], 1, "Fish lives in water; Bird lives in air");
  seedQuestion(153, #navodaya, #reasoning, "Folding", "Paper folded in half, hole punched. Holes when unfolded?", ["1", "2", "3", "4"], 1, "1 fold + 1 punch = 2 holes");
  seedQuestion(154, #navodaya, #reasoning, "Series", "Monday, Wednesday, Friday, ___", ["Saturday", "Sunday", "Monday", "Tuesday"], 1, "Skip one day: Sunday");
  seedQuestion(155, #navodaya, #reasoning, "Spatial", "How many faces does a cube have?", ["4", "5", "6", "8"], 2, "Cube has 6 faces");
  seedQuestion(156, #navodaya, #reasoning, "Completion", "AB, CD, EF, ___", ["GH", "GI", "HI", "HJ"], 0, "Consecutive pairs: GH");
  seedQuestion(157, #navodaya, #reasoning, "Mirror Image", "Mirror image of letter b is:", ["d", "p", "q", "g"], 0, "Mirror of b is d");
  seedQuestion(158, #navodaya, #reasoning, "Number Pattern", "64, 32, 16, 8, ___", ["6", "4", "3", "2"], 1, "Halved each time: 4");
  seedQuestion(159, #navodaya, #reasoning, "Shapes", "How many faces in a cube?", ["4", "5", "6", "8"], 2, "A cube has 6 faces");
  seedQuestion(160, #navodaya, #reasoning, "Direction", "If you face South and turn right, you face:", ["North", "South", "East", "West"], 3, "South + turn right = West");

  // MOCK TESTS (4 tests)
  seedMockTest(1, "RIMC Full Mock Test - Set 1", #rimc, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 31, 32, 33, 34, 35], 45);
  seedMockTest(2, "Sainik School Full Mock Test - Set 1", #sainikSchool, [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 61, 62, 63, 64, 65, 71, 72, 73, 74, 75], 45);
  seedMockTest(3, "RMS Full Mock Test - Set 1", #rms, [81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 101, 102, 103, 104, 105, 111, 112, 113, 114, 115], 45);
  seedMockTest(4, "Navodaya Full Mock Test - Set 1", #navodaya, [121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 141, 142, 143, 144, 145, 151, 152, 153, 154, 155], 45);

  // STUDY NOTES (12 notes)
  seedNote(1, #rimc, #math, "Number System Basics", "Number System includes Natural Numbers (1,2,3...), Whole Numbers (0,1,2,3...), Integers (...-2,-1,0,1,2...), and Rational Numbers (fractions). HCF (Highest Common Factor) is the largest number that divides two or more numbers. LCM (Least Common Multiple) is the smallest number that is a multiple of two or more numbers. Example: HCF of 12 and 18 is 6. LCM of 12 and 18 is 36.");
  seedNote(2, #rimc, #math, "Percentages, Profit-Loss and Simple Interest", "Percentage = (Part/Whole) × 100. Profit = SP - CP. Loss = CP - SP. Profit% = (Profit/CP) × 100. Loss% = (Loss/CP) × 100. Simple Interest = (P × R × T)/100 where P=Principal, R=Rate%, T=Time in years. Example: SI on Rs 1000 at 5% for 2 years = (1000×5×2)/100 = Rs 100.");
  seedNote(3, #rimc, #english, "Parts of Speech", "There are 8 parts of speech: 1) Noun - name of person, place, thing (boy, Delhi, book). 2) Pronoun - replaces noun (he, she, it). 3) Verb - action word (run, eat, sleep). 4) Adjective - describes noun (tall, beautiful). 5) Adverb - describes verb (quickly, slowly). 6) Preposition - shows relation (in, on, at). 7) Conjunction - joins words (and, but, or). 8) Interjection - shows emotion (wow!, alas!).");
  seedNote(4, #rimc, #english, "Tenses Quick Reference", "Simple Present: Used for habits and facts. Key words: always, usually, every day. Example: He goes to school. Simple Past: Used for completed actions. Key words: yesterday, last week, ago. Example: He went to school. Simple Future: Used for future actions. Key words: tomorrow, next week, will. Example: He will go to school. Remember: Use base verb with I/you/we/they. Add 's' or 'es' with he/she/it in present tense.");
  seedNote(5, #rimc, #gk, "Indian Army Key Facts", "Indian Army Motto: Service Before Self. Ranks (ascending): Sepoy, Naik, Havildar, Naib Subedar, Subedar, Subedar Major, Lieutenant, Captain, Major, Lieutenant Colonel, Colonel, Brigadier, Major General, Lieutenant General, General. Military Schools: RIMC (Rashtriya Indian Military College) Dehradun, Rashtriya Military Schools (5 locations), Sainik Schools (33 schools). NDA (National Defence Academy) Pune trains cadets for all three services.");
  seedNote(6, #rimc, #gk, "Indian Geography Essentials", "India borders: Pakistan (West), China, Nepal, Bhutan (North), Bangladesh, Myanmar (East). Oceans/Seas: Arabian Sea (West), Bay of Bengal (East), Indian Ocean (South). Major Rivers: Ganga (2525 km - longest), Brahmaputra, Yamuna, Godavari, Krishna, Narmada. Mountain Ranges: Himalayas (North), Western Ghats, Eastern Ghats. States: 28 states, 8 Union Territories. Capital: New Delhi. Largest state by area: Rajasthan. Smallest: Goa.");
  seedNote(7, #sainikSchool, #math, "Geometry Formulas", "Rectangle: Perimeter = 2(l+b), Area = l×b. Square: Perimeter = 4×side, Area = side². Triangle: Perimeter = a+b+c, Area = ½×base×height. Circle: Circumference = 2πr, Area = πr². Cube: Volume = side³, Surface Area = 6×side². Cuboid: Volume = l×b×h, Surface Area = 2(lb+bh+hl). Remember: π = 22/7 or 3.14. All measurements must be in same units.");
  seedNote(8, #sainikSchool, #gk, "India Defence Forces", "Three Wings: 1) Indian Army (Land forces) - Motto: Service Before Self. 2) Indian Navy (Sea forces) - Motto: Śaṁ No Varuṇaḥ. 3) Indian Air Force (Air forces) - Motto: Touch the Sky with Glory. Gallantry Awards (descending): Param Vir Chakra (wartime), Ashok Chakra (peacetime), Maha Vir Chakra, Kirti Chakra, Vir Chakra, Shaurya Chakra. Sainik Schools: Administered by Ministry of Defence, prepare boys for NDA.");
  seedNote(9, #rms, #math, "Algebra Fundamentals", "Variable: A symbol (usually x, y, z) representing unknown value. Constant: Fixed value (numbers). Expression: Combination of variables and constants (2x+3). Equation: Expression with equal sign (2x+3=7). Solving equations: Isolate variable on one side. Example: 2x+3=7 → 2x=7-3 → 2x=4 → x=2. Word Problems: Read carefully, identify unknown, form equation, solve. Example: Sum of two numbers is 15, one is 8, find other. Let other = x. x+8=15, x=7.");
  seedNote(10, #rms, #gk, "Our Solar System", "Planets in order from Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. Mnemonic: My Very Educated Mother Just Served Us Noodles. Inner Planets (Rocky): Mercury, Venus, Earth, Mars. Outer Planets (Gas Giants): Jupiter, Saturn, Uranus, Neptune. Largest: Jupiter. Smallest: Mercury. Only planet with life: Earth. Red Planet: Mars. Ringed Planet: Saturn. Earth's Moon: Natural satellite, takes 27.3 days to orbit Earth.");
  seedNote(11, #navodaya, #math, "Basic Arithmetic Operations", "BODMAS Rule: Brackets, Of (multiplication), Division, Multiplication, Addition, Subtraction. Always solve in this order. Four Operations: Addition (+), Subtraction (-), Multiplication (×), Division (÷). Properties: Commutative (a+b=b+a), Associative ((a+b)+c=a+(b+c)), Distributive (a×(b+c)=a×b+a×c). Shortcuts: Multiply by 10 - add zero. Divide by 10 - remove last digit. Multiply by 5 - multiply by 10 and divide by 2.");
  seedNote(12, #navodaya, #reasoning, "Spatial Reasoning for Navodaya", "Mirror Images: Left becomes right, right becomes left. Vertical axis reflection. Example: b becomes d. Paper Folding: Count folds and holes. 1 fold + 1 hole = 2 holes when unfolded. 2 folds + 1 hole = 4 holes. Figure Counting: Count systematically - small to large. Triangles, squares, rectangles. Rotation: 90° clockwise = quarter turn right. 180° = half turn. 270° = three-quarter turn. Practice with actual paper to understand patterns.");

  // Update counters after seeding
  nextQuestionId := 161;
  nextMockTestId := 5;
  nextNoteId := 13;

  // ---------- User Profile Functions ----------
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

  // ---------- Question Functions ----------
  // Public access - no authorization needed

  public query func getQuestionsByCategoryAndSubject(cat : ExamCategory, subj : Subject) : async [Question] {
    questions.values().toArray().filter(
      func(q) { q.examCategory == cat and q.subject == subj }
    );
  };

  public query func getPracticeQuestions(cat : ExamCategory, subj : Subject) : async [PracticeQuestion] {
    questions.values().toArray().filter(
      func(q) { q.examCategory == cat and q.subject == subj }
    ).sliceToArray(0, 10).map(
      func(q) {
        {
          id = q.id;
          examCategory = q.examCategory;
          subject = q.subject;
          topic = q.topic;
          question = q.question;
          options = q.options;
          correctAnswer = q.correctAnswer;
          explanation = q.explanation;
        };
      }
    );
  };

  // ---------- Mock Test Functions ----------
  // Public access - no authorization needed

  public query func getMockTestsByCategory(cat : ExamCategory) : async [MockTest] {
    mockTests.values().toArray().filter(
      func(test) { test.examCategory == cat }
    );
  };

  public query func getMockTestById(id : Nat) : async {
    test : MockTest;
    questions : [Question];
  } {
    switch (mockTests.get(id)) {
      case (null) { Runtime.trap("Test not found") };
      case (?test) {
        let qs = test.questionIds.filter(
          func(qid) { questions.containsKey(qid) }
        ).map(func(qid) { questions.get(qid).unwrap() });
        { test; questions = qs };
      };
    };
  };

  // ---------- Test Attempt Functions ----------
  // User-only access

  public query ({ caller }) func getUserAttempts() : async [TestAttempt] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their attempts");
    };
    testAttempts.toArray().filter(
      func(attempt) { attempt.principal == caller }
    );
  };

  public shared ({ caller }) func submitTestAttempt(testId : Nat, answers : [Nat], timeTaken : Nat) : async TestSubmissionResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit test attempts");
    };

    let test = switch (mockTests.get(testId)) {
      case (null) { Runtime.trap("Test not found") };
      case (?t) { t };
    };

    if (answers.size() != test.questionIds.size()) {
      Runtime.trap("Answer count mismatch");
    };

    let questionsOpt = test.questionIds.map(
      func(qid) { questions.get(qid) }
    );
    if (questionsOpt.any(func(opt) { opt == null })) {
      Runtime.trap("One or more questions not found");
    };

    let questionsList = questionsOpt.map(func(opt) { opt.unwrap() });

    var score = 0;
    for (i in Nat.range(0, answers.size())) {
      if (answers[i] == questionsList[i].correctAnswer) {
        score += 1;
      };
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
      percentage = score * 100 / questionsList.size();
      timeTaken;
    };
  };

  // ---------- Study Note Functions ----------
  // Public access - no authorization needed

  public query func getNotesByCategoryAndSubject(cat : ExamCategory, subj : Subject) : async [StudyNote] {
    notes.values().toArray().filter(
      func(note) { note.examCategory == cat and note.subject == subj }
    );
  };

  // ---------- Leaderboard Functions ----------
  // Public access - no authorization needed

  public query func getLeaderboardByCategory(cat : ExamCategory) : async [LeaderboardEntry] {
    let categoryTestIds = mockTests.values().toArray().filter(
      func(test) { test.examCategory == cat }
    ).map(func(test) { test.id });

    let categoryAttempts = testAttempts.toArray().filter(
      func(attempt) {
        categoryTestIds.any(func(id) { id == attempt.testId });
      }
    );

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

  // ---------- Admin (Content) Functions ----------
  // Admin-only access

  public shared ({ caller }) func addQuestion(questionInput : QuestionInput) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add questions");
    };

    let q : Question = {
      id = nextQuestionId;
      examCategory = questionInput.examCategory;
      subject = questionInput.subject;
      topic = questionInput.topic;
      question = questionInput.question;
      options = questionInput.options;
      correctAnswer = questionInput.correctAnswer;
      explanation = questionInput.explanation;
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

  public shared ({ caller }) func addStudyNote(noteInput : StudyNoteInput) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add notes");
    };

    let note : StudyNote = {
      id = nextNoteId;
      examCategory = noteInput.examCategory;
      subject = noteInput.subject;
      topic = noteInput.topic;
      content = noteInput.content;
    };

    notes.add(nextNoteId, note);
    nextNoteId += 1;
  };

  // ---------- Stripe Payment Integration ----------
  // Public query for configuration check, admin-only for setting

  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  public shared ({ caller }) func clearStripeConfiguration() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := null;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be configured first") };
      case (?value) { value };
    };
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  // ---------- Razorpay Payment Integration ----------
  // Public query for configuration check and key retrieval, admin-only for setting

  public query func isRazorpayConfigured() : async Bool {
    razorpayKeyId != null;
  };

  public query func getRazorpayKeyId() : async ?Text {
    razorpayKeyId;
  };

  public shared ({ caller }) func setRazorpayKeyId(key : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    razorpayKeyId := ?key;
  };

  public shared ({ caller }) func clearRazorpayKeyId() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    razorpayKeyId := null;
  };

  // ---------- Admin Claiming Function ----------
  public shared ({ caller }) func claimFirstAdmin() : async () {
    // Silently ignore if admin already assigned
    if (accessControlState.adminAssigned) {
      return ();
    };

    // Anonymous principals cannot claim admin
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principal is not allowed to claim admin role");
    };

    // Check current role - guests can claim, users and admins cannot
    let currentRole = AccessControl.getUserRole(accessControlState, caller);

    switch (currentRole) {
      case (#admin) {
        // Already admin, silently return
        return ();
      };
      case (#user) {
        // Users cannot claim admin
        Runtime.trap("Not authorized (user role)");
      };
      case (#guest) {
        // Guest can claim admin - this is the valid path
        AccessControl.assignRole(accessControlState, caller, caller, #admin);
      };
    };
  };
};
