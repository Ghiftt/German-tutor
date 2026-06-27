const fs = require('fs');

const lessons = [
  {
    id: "A1-L01",
    title: "Hallo! - Greetings",
    level: "A1",
    chapter: "Intro",
    grammar_topic: "Basic sentence structure: Ich bin, Das ist",
    vocabulary: [
      { word: "Hallo", translation: "Hello" },
      { word: "Guten Morgen", translation: "Good morning" },
      { word: "Guten Tag", translation: "Good day" },
      { word: "Guten Abend", translation: "Good evening" },
      { word: "Gute Nacht", translation: "Good night" },
      { word: "Auf Wiedersehen", translation: "Goodbye (formal)" },
      { word: "Tschuess", translation: "Bye (informal)" },
      { word: "Wie geht es Ihnen?", translation: "How are you? (formal)" },
      { word: "Wie geht es dir?", translation: "How are you? (informal)" },
      { word: "Gut, danke", translation: "Good, thank you" },
      { word: "Nicht so gut", translation: "Not so good" }
    ],
    grammar: {
      topic: "sein (to be) - present tense",
      forms: {
        "ich bin": "I am",
        "du bist": "you are (informal)",
        "er/sie/es ist": "he/she/it is",
        "wir sind": "we are",
        "ihr seid": "you are (plural)",
        "sie/Sie sind": "they are / you are (formal)"
      }
    },
    objectives: [
      "Say hello and goodbye formally and informally",
      "Ask and answer how someone is doing",
      "Use sein (to be) in present tense"
    ],
    nursing_note: "You will greet patients and colleagues every shift. Guten Morgen and Wie geht es Ihnen are used dozens of times daily.",
    mastery_pass_score: 80
  },
  {
    id: "A1-L02",
    title: "Kein Problem! - Basic Sentences",
    level: "A1",
    chapter: "Intro",
    grammar_topic: "Verb position in statements and questions",
    vocabulary: [
      { word: "Ja", translation: "Yes" },
      { word: "Nein", translation: "No" },
      { word: "Bitte", translation: "Please / You are welcome" },
      { word: "Danke", translation: "Thank you" },
      { word: "Entschuldigung", translation: "Excuse me / Sorry" },
      { word: "Kein Problem", translation: "No problem" },
      { word: "Ich verstehe nicht", translation: "I do not understand" },
      { word: "Bitte wiederholen Sie", translation: "Please repeat (formal)" },
      { word: "Langsamer bitte", translation: "Slower please" },
      { word: "Ich spreche ein bisschen Deutsch", translation: "I speak a little German" }
    ],
    grammar: {
      topic: "Verb position - verb is always second element",
      forms: {
        "Ich komme aus Nigeria": "I come from Nigeria",
        "Komme ich aus Nigeria?": "WRONG - verb must be second",
        "Woher kommst du?": "Where do you come from?",
        "Ich wohne in Deutschland": "I live in Germany"
      }
    },
    objectives: [
      "Use basic courtesy phrases",
      "Say you do not understand and ask for repetition",
      "Understand verb position in German sentences"
    ],
    nursing_note: "Entschuldigung and Ich verstehe nicht are critical survival phrases for your first weeks in Germany.",
    mastery_pass_score: 80
  },
  {
    id: "A1-L03",
    title: "Von A bis Z - The German Alphabet",
    level: "A1",
    chapter: "Intro",
    grammar_topic: "German alphabet and spelling",
    vocabulary: [
      { word: "A - Anton", translation: "A as in Anton" },
      { word: "B - Berta", translation: "B as in Berta" },
      { word: "C - Caesar", translation: "C as in Caesar" },
      { word: "D - Dora", translation: "D as in Dora" },
      { word: "E - Emil", translation: "E as in Emil" },
      { word: "F - Friedrich", translation: "F as in Friedrich" },
      { word: "G - Gustav", translation: "G as in Gustav" },
      { word: "H - Heinrich", translation: "H as in Heinrich" },
      { word: "I - Ida", translation: "I as in Ida" },
      { word: "J - Julius", translation: "J as in Julius" },
      { word: "K - Kaufmann", translation: "K as in Kaufmann" },
      { word: "L - Ludwig", translation: "L as in Ludwig" },
      { word: "M - Martha", translation: "M as in Martha" },
      { word: "N - Nordpol", translation: "N as in Nordpol" },
      { word: "O - Otto", translation: "O as in Otto" },
      { word: "P - Paula", translation: "P as in Paula" },
      { word: "Q - Quelle", translation: "Q as in Quelle" },
      { word: "R - Richard", translation: "R as in Richard" },
      { word: "S - Samuel", translation: "S as in Samuel" },
      { word: "T - Theodor", translation: "T as in Theodor" },
      { word: "U - Ulrich", translation: "U as in Ulrich" },
      { word: "V - Viktor", translation: "V as in Viktor" },
      { word: "W - Wilhelm", translation: "W as in Wilhelm" },
      { word: "X - Xanthippe", translation: "X as in Xanthippe" },
      { word: "Y - Ypsilon", translation: "Y as in Ypsilon" },
      { word: "Z - Zacharias", translation: "Z as in Zacharias" },
      { word: "Ae - Umlaut A", translation: "ae sound (Arzt, Affe)" },
      { word: "Oe - Umlaut O", translation: "oe sound (schoen, offen)" },
      { word: "Ue - Umlaut U", translation: "ue sound (ueber, Tuer)" },
      { word: "ss - Eszett", translation: "ss sound (heissen, Strasse)" }
    ],
    grammar: {
      topic: "German spelling conventions",
      forms: {
        "Wie schreibt man das?": "How do you spell that?",
        "Buchstabieren Sie bitte": "Please spell it",
        "Gross- und Kleinschreibung": "Capitalization - ALL nouns are capitalized",
        "Der, die, das": "All nouns have a gender - must be learned with each word"
      }
    },
    objectives: [
      "Recite and recognize all German letters",
      "Spell your name and words letter by letter",
      "Understand German umlaut sounds ae, oe, ue and ss",
      "Know that all German nouns are capitalized"
    ],
    nursing_note: "You will spell patient names, medication names, and read German documents daily. The alphabet is not optional.",
    mastery_pass_score: 80
  },
  {
    id: "A1-L04",
    title: "Ich heisse Emma - Introducing Yourself",
    level: "A1",
    chapter: "Meeting People",
    grammar_topic: "Personal pronouns and heissen, kommen, wohnen",
    vocabulary: [
      { word: "Ich heisse...", translation: "My name is... (I am called...)" },
      { word: "Wie heissen Sie?", translation: "What is your name? (formal)" },
      { word: "Wie heisst du?", translation: "What is your name? (informal)" },
      { word: "Ich komme aus...", translation: "I come from..." },
      { word: "Woher kommen Sie?", translation: "Where are you from? (formal)" },
      { word: "Ich wohne in...", translation: "I live in..." },
      { word: "Wo wohnen Sie?", translation: "Where do you live? (formal)" },
      { word: "Ich bin Krankenpflegerin", translation: "I am a nurse (female)" },
      { word: "Ich bin Krankenpfleger", translation: "I am a nurse (male)" },
      { word: "Ich lerne Deutsch", translation: "I am learning German" },
      { word: "Freut mich", translation: "Nice to meet you" },
      { word: "du", translation: "you (informal - friends, family, children)" },
      { word: "Sie", translation: "you (formal - always capitalized)" }
    ],
    grammar: {
      topic: "du vs Sie - informal vs formal address",
      forms: {
        "du - friends, family, children": "Use with people you know well",
        "Sie - doctors, patients, strangers": "Use with everyone else - always capitalize",
        "heissen": "to be called: ich heisse, du heisst, er/sie heisst",
        "kommen": "to come: ich komme, du kommst, er/sie kommt",
        "wohnen": "to live: ich wohne, du wohnst, er/sie wohnt"
      }
    },
    objectives: [
      "Introduce yourself with name, origin, and profession",
      "Ask others for their name and origin",
      "Use du and Sie correctly",
      "Conjugate heissen, kommen, wohnen"
    ],
    nursing_note: "In German hospitals you always use Sie with patients and senior colleagues. Using du with a patient you do not know is rude.",
    mastery_pass_score: 80
  },
  {
    id: "A1-L05",
    title: "Das ist Nico - Introducing Others",
    level: "A1",
    chapter: "Meeting People",
    grammar_topic: "Nominative articles der, die, das and indefinite ein, eine",
    vocabulary: [
      { word: "Das ist...", translation: "This is..." },
      { word: "Das sind...", translation: "These are..." },
      { word: "der Mann", translation: "the man (masculine)" },
      { word: "die Frau", translation: "the woman (feminine)" },
      { word: "das Kind", translation: "the child (neuter)" },
      { word: "der Arzt", translation: "the doctor (male)" },
      { word: "die Aerztin", translation: "the doctor (female)" },
      { word: "die Krankenschwester", translation: "the nurse (female)" },
      { word: "der Krankenpfleger", translation: "the nurse (male)" },
      { word: "der Patient", translation: "the patient (male)" },
      { word: "die Patientin", translation: "the patient (female)" },
      { word: "ein Kollege", translation: "a colleague (male)" },
      { word: "eine Kollegin", translation: "a colleague (female)" }
    ],
    grammar: {
      topic: "German articles - the hardest rule in A1",
      forms: {
        "der (masculine)": "der Mann, der Arzt, der Patient",
        "die (feminine)": "die Frau, die Aerztin, die Krankenschwester",
        "das (neuter)": "das Kind, das Krankenhaus, das Zimmer",
        "die (plural)": "die Maenner, die Frauen, die Kinder",
        "Rule": "Always learn the article WITH the noun. Never learn a noun alone."
      }
    },
    objectives: [
      "Introduce other people",
      "Use der, die, das correctly with common nouns",
      "Learn key hospital people vocabulary",
      "Understand that articles must be memorized with each noun"
    ],
    nursing_note: "Das Krankenhaus (hospital), das Zimmer (room), die Station (ward), der Patient - you will use these from day one.",
    mastery_pass_score: 80
  },
  {
    id: "A1-L06",
    title: "Woher kommst du? - Countries and Languages",
    level: "A1",
    chapter: "Meeting People",
    grammar_topic: "Country names, nationalities, and language names",
    vocabulary: [
      { word: "Nigeria", translation: "Nigeria" },
      { word: "Deutschland", translation: "Germany" },
      { word: "Oesterreich", translation: "Austria" },
      { word: "die Schweiz", translation: "Switzerland" },
      { word: "Ich komme aus Nigeria", translation: "I come from Nigeria" },
      { word: "Ich bin Nigerianerin", translation: "I am Nigerian (female)" },
      { word: "Ich bin Nigerianer", translation: "I am Nigerian (male)" },
      { word: "Ich spreche Englisch", translation: "I speak English" },
      { word: "Ich spreche Deutsch", translation: "I speak German" },
      { word: "Meine Muttersprache ist Englisch", translation: "My mother tongue is English" },
      { word: "Ich lerne Deutsch seit drei Monaten", translation: "I have been learning German for three months" },
      { word: "Welche Sprachen sprechen Sie?", translation: "What languages do you speak?" }
    ],
    grammar: {
      topic: "sprechen conjugation and seit + time",
      forms: {
        "ich spreche": "I speak",
        "du sprichst": "you speak (note vowel change e to i)",
        "er/sie spricht": "he/she speaks (note vowel change)",
        "seit drei Monaten": "for three months (seit = since/for with present tense)",
        "seit einem Jahr": "for one year"
      }
    },
    objectives: [
      "Say which country you come from",
      "Name your nationality and language",
      "Use sprechen with vowel change",
      "Use seit to say how long you have been doing something"
    ],
    nursing_note: "You will be asked about your background constantly in Germany. Practice this until it is automatic.",
    mastery_pass_score: 80
  },
  {
    id: "A1-L07",
    title: "Zahlen 1-100 - Numbers",
    level: "A1",
    chapter: "Contact Details",
    grammar_topic: "Cardinal numbers and phone numbers",
    vocabulary: [
      { word: "eins", translation: "1" },
      { word: "zwei", translation: "2" },
      { word: "drei", translation: "3" },
      { word: "vier", translation: "4" },
      { word: "fuenf", translation: "5" },
      { word: "sechs", translation: "6" },
      { word: "sieben", translation: "7" },
      { word: "acht", translation: "8" },
      { word: "neun", translation: "9" },
      { word: "zehn", translation: "10" },
      { word: "elf", translation: "11" },
      { word: "zwoelf", translation: "12" },
      { word: "zwanzig", translation: "20" },
      { word: "dreissig", translation: "30" },
      { word: "vierzig", translation: "40" },
      { word: "fuenfzig", translation: "50" },
      { word: "sechzig", translation: "60" },
      { word: "siebzig", translation: "70" },
      { word: "achtzig", translation: "80" },
      { word: "neunzig", translation: "90" },
      { word: "hundert", translation: "100" },
      { word: "einundzwanzig", translation: "21 - note: ones before tens" },
      { word: "vierundvierzig", translation: "44 - four and forty" }
    ],
    grammar: {
      topic: "German number construction",
      forms: {
        "1-12": "Irregular - must memorize: eins, zwei, drei, vier, fuenf, sechs, sieben, acht, neun, zehn, elf, zwoelf",
        "13-19": "Add -zehn: dreizehn, vierzehn, fuenfzehn...",
        "20, 30, 40...": "zwanzig, dreissig, vierzig, fuenfzig, sechzig, siebzig, achtzig, neunzig",
        "21, 22...": "ones + und + tens: einundzwanzig, zweiundzwanzig",
        "Important": "German says 21 as 'one-and-twenty' not 'twenty-one'"
      }
    },
    objectives: [
      "Count from 1 to 100",
      "Give and understand phone numbers",
      "Understand German number construction (ones before tens)",
      "Use numbers for addresses and room numbers"
    ],
    nursing_note: "Room numbers, patient ages, medication doses, vital signs - numbers are everywhere in nursing. Get these perfect.",
    mastery_pass_score: 80
  },
  {
    id: "A1-L08",
    title: "Uhrzeiten - Telling the Time",
    level: "A1",
    chapter: "Daily Life",
    grammar_topic: "Clock time - official and colloquial",
    vocabulary: [
      { word: "Wie spaet ist es?", translation: "What time is it?" },
      { word: "Es ist acht Uhr", translation: "It is 8 o'clock" },
      { word: "Es ist halb neun", translation: "It is half past eight (lit: half nine)" },
      { word: "Es ist Viertel nach acht", translation: "It is quarter past eight" },
      { word: "Es ist Viertel vor neun", translation: "It is quarter to nine" },
      { word: "Um wie viel Uhr?", translation: "At what time?" },
      { word: "Um 14:00 Uhr", translation: "At 14:00 (2pm) - official/24h time" },
      { word: "morgens", translation: "in the morning" },
      { word: "mittags", translation: "at midday" },
      { word: "nachmittags", translation: "in the afternoon" },
      { word: "abends", translation: "in the evening" },
      { word: "nachts", translation: "at night" },
      { word: "die Spaetschicht", translation: "the late shift" },
      { word: "die Fruehschicht", translation: "the early shift" },
      { word: "die Nachtschicht", translation: "the night shift" }
    ],
    grammar: {
      topic: "halb - the tricky German half hour",
      forms: {
        "halb neun": "8:30 NOT 9:30 - half BEFORE the next hour",
        "halb drei": "2:30",
        "halb zwoelf": "11:30",
        "Official time": "In hospitals always use 24h: acht Uhr dreissig, vierzehn Uhr",
        "Schicht beginnt um 6:00 Uhr": "Shift starts at 6:00"
      }
    },
    objectives: [
      "Tell and ask the time in German",
      "Understand halb (half hour) correctly",
      "Use 24-hour official time for work",
      "Name the three nursing shifts"
    ],
    nursing_note: "Shift handovers happen at exact times. Getting halb wrong means arriving an hour late. This is critical.",
    mastery_pass_score: 80
  },
  {
    id: "A1-L09",
    title: "Wochentage und Monate - Days and Months",
    level: "A1",
    chapter: "Daily Life",
    grammar_topic: "Days, months, dates, and am/im prepositions",
    vocabulary: [
      { word: "Montag", translation: "Monday" },
      { word: "Dienstag", translation: "Tuesday" },
      { word: "Mittwoch", translation: "Wednesday" },
      { word: "Donnerstag", translation: "Thursday" },
      { word: "Freitag", translation: "Friday" },
      { word: "Samstag", translation: "Saturday" },
      { word: "Sonntag", translation: "Sunday" },
      { word: "Januar", translation: "January" },
      { word: "Februar", translation: "February" },
      { word: "Maerz", translation: "March" },
      { word: "April", translation: "April" },
      { word: "Mai", translation: "May" },
      { word: "Juni", translation: "June" },
      { word: "Juli", translation: "July" },
      { word: "August", translation: "August" },
      { word: "September", translation: "September" },
      { word: "Oktober", translation: "October" },
      { word: "November", translation: "November" },
      { word: "Dezember", translation: "December" },
      { word: "heute", translation: "today" },
      { word: "morgen", translation: "tomorrow" },
      { word: "gestern", translation: "yesterday" }
    ],
    grammar: {
      topic: "am for days, im for months",
      forms: {
        "am Montag": "on Monday - am = an + dem",
        "am Wochenende": "at the weekend",
        "im Januar": "in January",
        "im Sommer": "in summer",
        "am 3. Mai": "on the 3rd of May - ordinal numbers end in -ten/-sten"
      }
    },
    objectives: [
      "Name all days of the week and months",
      "Use am with days and im with months",
      "Say today, tomorrow, yesterday",
      "Read and write simple dates"
    ],
    nursing_note: "You will document dates on patient charts, schedule shifts, and book appointments. Days and months must be perfect.",
    mastery_pass_score: 80
  },
  {
    id: "A1-L10",
    title: "Berufe - Jobs and Professions",
    level: "A1",
    chapter: "Work",
    grammar_topic: "Professions with sein, masculine and feminine forms",
    vocabulary: [
      { word: "der Beruf", translation: "the profession / job" },
      { word: "Was sind Sie von Beruf?", translation: "What is your profession?" },
      { word: "Ich bin Krankenpflegerin", translation: "I am a nurse (female) - no article!" },
      { word: "der Krankenpfleger", translation: "male nurse" },
      { word: "die Krankenpflegerin", translation: "female nurse" },
      { word: "der Arzt", translation: "doctor (male)" },
      { word: "die Aerztin", translation: "doctor (female)" },
      { word: "die Pflegehelferin", translation: "nursing assistant (female)" },
      { word: "die Station", translation: "the ward" },
      { word: "das Krankenhaus", translation: "the hospital" },
      { word: "die Ausbildung", translation: "the vocational training" },
      { word: "der Azubi", translation: "the apprentice / trainee" },
      { word: "arbeiten", translation: "to work" },
      { word: "Ich arbeite im Krankenhaus", translation: "I work in the hospital" }
    ],
    grammar: {
      topic: "Professions use NO article with sein",
      forms: {
        "Ich bin Krankenpflegerin": "CORRECT - no article",
        "Ich bin eine Krankenpflegerin": "WRONG for sein + profession",
        "feminine form": "usually add -in to masculine: Pfleger -> Pflegerin",
        "arbeiten": "ich arbeite, du arbeitest, er/sie arbeitet, wir arbeiten"
      }
    },
    objectives: [
      "Say your profession and ask others",
      "Use sein with professions without an article",
      "Know key hospital job titles",
      "Conjugate arbeiten"
    ],
    nursing_note: "Ich bin Krankenpflegerin in Ausbildung (I am a nursing trainee) is how you introduce yourself professionally in Germany.",
    mastery_pass_score: 80
  },
  {
    id: "A1-L11",
    title: "Essen und Trinken - Food and Drink",
    level: "A1",
    chapter: "Food",
    grammar_topic: "Accusative case with direct objects and moechten",
    vocabulary: [
      { word: "das Fruehstueck", translation: "breakfast" },
      { word: "das Mittagessen", translation: "lunch" },
      { word: "das Abendessen", translation: "dinner" },
      { word: "das Brot", translation: "bread" },
      { word: "die Suppe", translation: "soup" },
      { word: "das Fleisch", translation: "meat" },
      { word: "das Gemuese", translation: "vegetables" },
      { word: "das Wasser", translation: "water" },
      { word: "der Kaffee", translation: "coffee" },
      { word: "der Tee", translation: "tea" },
      { word: "Ich moechte...", translation: "I would like..." },
      { word: "Ich esse kein Fleisch", translation: "I do not eat meat" },
      { word: "Haben Sie Allergien?", translation: "Do you have allergies?" },
      { word: "Ich bin vegetarisch", translation: "I am vegetarian" },
      { word: "zahlen bitte", translation: "the bill please" }
    ],
    grammar: {
      topic: "moechten (would like) and accusative for direct object",
      forms: {
        "ich moechte": "I would like",
        "du moechtest": "you would like",
        "er/sie moechte": "he/she would like",
        "accusative: der -> den": "Ich moechte den Kaffee",
        "accusative: die/das unchanged": "Ich moechte die Suppe / das Brot"
      }
    },
    objectives: [
      "Order food and drink politely",
      "Say what you eat and do not eat",
      "Use moechten correctly",
      "Understand first accusative case rule: der becomes den"
    ],
    nursing_note: "You will ask patients about their meals, allergies, and dietary restrictions daily. Haben Sie Allergien? is a standard intake question.",
    mastery_pass_score: 80
  },
  {
    id: "A1-L12",
    title: "Wohnen - Home and Living",
    level: "A1",
    chapter: "Home",
    grammar_topic: "Prepositions of place: in, an, auf, neben, vor, hinter, zwischen",
    vocabulary: [
      { word: "die Wohnung", translation: "the apartment" },
      { word: "das Zimmer", translation: "the room" },
      { word: "das Schlafzimmer", translation: "the bedroom" },
      { word: "das Badezimmer", translation: "the bathroom" },
      { word: "die Kueche", translation: "the kitchen" },
      { word: "das Wohnzimmer", translation: "the living room" },
      { word: "das Bett", translation: "the bed" },
      { word: "der Schrank", translation: "the wardrobe" },
      { word: "der Tisch", translation: "the table" },
      { word: "der Stuhl", translation: "the chair" },
      { word: "links", translation: "on the left" },
      { word: "rechts", translation: "on the right" },
      { word: "geradeaus", translation: "straight ahead" },
      { word: "die WG (Wohngemeinschaft)", translation: "shared apartment - very common for Azubis" }
    ],
    grammar: {
      topic: "Two-way prepositions: dative for location, accusative for movement",
      forms: {
        "Wo ist das Bett?": "Where is the bed? -> dative: Das Bett ist im Zimmer",
        "Wohin gehst du?": "Where are you going? -> accusative: Ich gehe ins Zimmer",
        "im = in + dem (dative)": "location",
        "ins = in + das (accusative)": "movement towards"
      }
    },
    objectives: [
      "Describe your home and rooms",
      "Use prepositions of place correctly",
      "Understand the location vs movement rule",
      "Know WG vocabulary for your Ausbildung accommodation"
    ],
    nursing_note: "Most Azubis live in a WG. Das Patientenzimmer (patient room), das Schwesternzimmer (nurses station) use the same room vocabulary.",
    mastery_pass_score: 80
  },
  {
    id: "A1-L13",
    title: "Wegbeschreibung - Giving Directions",
    level: "A1",
    chapter: "Places",
    grammar_topic: "Imperative form and prepositions of direction",
    vocabulary: [
      { word: "Wo ist...?", translation: "Where is...?" },
      { word: "Wie komme ich zu...?", translation: "How do I get to...?" },
      { word: "Gehen Sie geradeaus", translation: "Go straight ahead (formal)" },
      { word: "Biegen Sie links ab", translation: "Turn left (formal)" },
      { word: "Biegen Sie rechts ab", translation: "Turn right (formal)" },
      { word: "Die erste Strasse links", translation: "The first street on the left" },
      { word: "Die zweite Strasse rechts", translation: "The second street on the right" },
      { word: "gegenueber", translation: "opposite" },
      { word: "neben", translation: "next to" },
      { word: "das Krankenhaus", translation: "the hospital" },
      { word: "die Apotheke", translation: "the pharmacy" },
      { word: "der Bahnhof", translation: "the train station" },
      { word: "die Haltestelle", translation: "the bus/tram stop" }
    ],
    grammar: {
      topic: "Imperative (command form) for formal Sie",
      forms: {
        "Gehen Sie...": "Go... (formal command)",
        "Nehmen Sie...": "Take... (formal command)",
        "Biegen Sie ab": "Turn... (formal command)",
        "Formation": "Verb + Sie: fahren -> Fahren Sie, nehmen -> Nehmen Sie"
      }
    },
    objectives: [
      "Ask and give directions",
      "Use formal imperative Sie commands",
      "Name key places in a German town",
      "Understand direction prepositions"
    ],
    nursing_note: "Patients and visitors will ask you for directions in the hospital constantly. Gehen Sie geradeaus, dann links is something you will say daily.",
    mastery_pass_score: 80
  },
  {
    id: "A1-L14",
    title: "Familie - Family Members",
    level: "A1",
    chapter: "Family",
    grammar_topic: "Possessive pronouns: mein, dein, sein, ihr",
    vocabulary: [
      { word: "die Familie", translation: "the family" },
      { word: "die Mutter", translation: "the mother" },
      { word: "der Vater", translation: "the father" },
      { word: "die Eltern", translation: "the parents (plural)" },
      { word: "die Schwester", translation: "the sister" },
      { word: "der Bruder", translation: "the brother" },
      { word: "die Geschwister", translation: "siblings (plural)" },
      { word: "die Grossmutter", translation: "the grandmother" },
      { word: "der Grossvater", translation: "the grandfather" },
      { word: "die Grosseltern", translation: "grandparents (plural)" },
      { word: "der Sohn", translation: "the son" },
      { word: "die Tochter", translation: "the daughter" },
      { word: "verheiratet", translation: "married" },
      { word: "ledig", translation: "single" },
      { word: "Ich habe zwei Geschwister", translation: "I have two siblings" }
    ],
    grammar: {
      topic: "Possessive pronouns agree with the noun they describe",
      forms: {
        "mein Vater (masc)": "my father",
        "meine Mutter (fem)": "my mother",
        "mein Kind (neuter)": "my child",
        "meine Eltern (plural)": "my parents",
        "sein/ihr": "his/her - agrees with owner not the thing owned"
      }
    },
    objectives: [
      "Name family members",
      "Use possessive pronouns correctly",
      "Describe your family situation",
      "Understand mein/meine agreement with noun gender"
    ],
    nursing_note: "You will ask patients about their family situation for medical history. Haben Sie Kinder? Leben Ihre Eltern noch? are common intake questions.",
    mastery_pass_score: 80
  },
  {
    id: "A1-L15",
    title: "Freizeit - Hobbies and Free Time",
    level: "A1",
    chapter: "Leisure",
    grammar_topic: "Modal verbs: koennen, moegen, wollen, muessen",
    vocabulary: [
      { word: "die Freizeit", translation: "free time" },
      { word: "das Hobby", translation: "hobby" },
      { word: "Sport treiben", translation: "to do sport" },
      { word: "lesen", translation: "to read" },
      { word: "Musik hoeren", translation: "to listen to music" },
      { word: "kochen", translation: "to cook" },
      { word: "tanzen", translation: "to dance" },
      { word: "ins Kino gehen", translation: "to go to the cinema" },
      { word: "ich mag", translation: "I like" },
      { word: "ich mag nicht", translation: "I do not like" },
      { word: "ich kann", translation: "I can" },
      { word: "ich will", translation: "I want to" },
      { word: "ich muss", translation: "I must / have to" },
      { word: "Was machst du in der Freizeit?", translation: "What do you do in your free time?" }
    ],
    grammar: {
      topic: "Modal verbs - verb goes to end of sentence",
      forms: {
        "koennen": "can: ich kann, du kannst, er/sie kann",
        "moegen": "to like: ich mag, du magst, er/sie mag",
        "wollen": "to want: ich will, du willst, er/sie will",
        "muessen": "must: ich muss, du musst, er/sie muss",
        "Word order": "Modal verb is second, infinitive goes to END: Ich kann Deutsch sprechen"
      }
    },
    objectives: [
      "Talk about hobbies and free time",
      "Use modal verbs koennen, moegen, wollen, muessen",
      "Apply the modal verb word order rule",
      "Ask and answer questions about free time"
    ],
    nursing_note: "Ich muss arbeiten, Ich kann nicht kommen - modal verbs are used constantly in workplace communication.",
    mastery_pass_score: 80
  },
  {
    id: "A1-L16",
    title: "Gesundheit - Health and Body",
    level: "A1",
    chapter: "Health",
    grammar_topic: "haben + accusative for ailments, body parts with articles",
    vocabulary: [
      { word: "der Koerper", translation: "the body" },
      { word: "der Kopf", translation: "the head" },
      { word: "der Hals", translation: "the throat / neck" },
      { word: "die Brust", translation: "the chest" },
      { word: "der Bauch", translation: "the stomach / abdomen" },
      { word: "der Ruecken", translation: "the back" },
      { word: "der Arm", translation: "the arm" },
      { word: "das Bein", translation: "the leg" },
      { word: "Ich habe Kopfschmerzen", translation: "I have a headache" },
      { word: "Ich habe Bauchschmerzen", translation: "I have stomach pain" },
      { word: "Mir ist schlecht", translation: "I feel sick / nauseous" },
      { word: "Ich habe Fieber", translation: "I have a fever" },
      { word: "Wo tut es weh?", translation: "Where does it hurt?" },
      { word: "Es tut hier weh", translation: "It hurts here" },
      { word: "Gute Besserung!", translation: "Get well soon!" },
      { word: "der Notfall", translation: "the emergency" }
    ],
    grammar: {
      topic: "Schmerzen compound words and mir ist + adjective",
      forms: {
        "Kopf + Schmerzen = Kopfschmerzen": "headache - German compounds two nouns",
        "Bauch + Schmerzen = Bauchschmerzen": "stomach ache",
        "Mir ist schlecht": "I feel sick - mir (dative) not ich",
        "Mir ist warm/kalt": "I am warm/cold - same dative pattern",
        "Ich habe Fieber": "I have a fever - no article with Fieber"
      }
    },
    objectives: [
      "Name all major body parts",
      "Describe pain and symptoms",
      "Ask where it hurts",
      "Use mir ist for feelings",
      "Know emergency vocabulary"
    ],
    nursing_note: "This is the most critical A1 lesson for nursing. Wo tut es weh, Haben Sie Schmerzen, Ich rufe den Arzt - you need this from your first shift.",
    mastery_pass_score: 80
  },
  {
    id: "A1-L17",
    title: "Einkaufen - Shopping",
    level: "A1",
    chapter: "Shopping",
    grammar_topic: "Prices, quantities, and accusative with einkaufen",
    vocabulary: [
      { word: "der Supermarkt", translation: "the supermarket" },
      { word: "die Apotheke", translation: "the pharmacy" },
      { word: "Was kostet das?", translation: "How much does that cost?" },
      { word: "Das kostet 5 Euro", translation: "That costs 5 euros" },
      { word: "Ich nehme das", translation: "I will take that" },
      { word: "Haben Sie...?", translation: "Do you have...?" },
      { word: "ein Kilo", translation: "one kilogram" },
      { word: "eine Flasche", translation: "a bottle" },
      { word: "eine Packung", translation: "a packet" },
      { word: "zu teuer", translation: "too expensive" },
      { word: "guenstig", translation: "cheap / affordable" },
      { word: "die Kasse", translation: "the checkout / cash register" },
      { word: "Kann ich mit Karte zahlen?", translation: "Can I pay by card?" }
    ],
    grammar: {
      topic: "Accusative: definite article der changes to den",
      forms: {
        "Ich kaufe den Apfel (masc -> den)": "I buy the apple",
        "Ich kaufe die Milch (fem -> die)": "I buy the milk",
        "Ich kaufe das Brot (neuter -> das)": "I buy the bread",
        "Ich kaufe die Aepfel (plural -> die)": "I buy the apples",
        "Summary": "Only masculine changes in accusative: der -> den"
      }
    },
    objectives: [
      "Ask prices and buy things",
      "Use quantities and containers",
      "Apply accusative case for masculine nouns",
      "Shop at a supermarket and pharmacy"
    ],
    nursing_note: "The Apotheke (pharmacy) is where you will buy personal items and where patients get prescriptions. Knowing pharmacy vocabulary is practical immediately.",
    mastery_pass_score: 80
  },
  {
    id: "A1-L18",
    title: "Ich traeume von... - Wishes and Dreams",
    level: "A1",
    chapter: "Future Plans",
    grammar_topic: "wuerde gern, haette gern, and future with werden",
    vocabulary: [
      { word: "Ich wuerde gern...", translation: "I would like to... (wish for an action)" },
      { word: "Ich haette gern...", translation: "I would like to have... (wish for a thing)" },
      { word: "Ich moechte in Deutschland arbeiten", translation: "I want to work in Germany" },
      { word: "Ich will Krankenpflegerin werden", translation: "I want to become a nurse" },
      { word: "der Traum", translation: "the dream" },
      { word: "die Zukunft", translation: "the future" },
      { word: "Ich werde...lernen", translation: "I will learn... (future with werden)" },
      { word: "Ich hoffe", translation: "I hope" },
      { word: "Mein Ziel ist...", translation: "My goal is..." },
      { word: "die Ausbildung abschliessen", translation: "to complete the training" },
      { word: "Ich bin zuversichtlich", translation: "I am confident" },
      { word: "Es wird klappen", translation: "It will work out" }
    ],
    grammar: {
      topic: "werden for future + wuerde gern for wishes",
      forms: {
        "werden (future)": "ich werde, du wirst, er/sie wird, wir werden",
        "Ich werde Deutsch lernen": "I will learn German - infinitive at end",
        "wuerde gern + infinitive": "would like to do something",
        "haette gern + noun": "would like to have something",
        "Difference": "wuerde gern arbeiten (action) vs haette gern einen Job (thing)"
      }
    },
    objectives: [
      "Talk about your future plans and goals",
      "Use werden for future tense",
      "Use wuerde gern and haette gern",
      "Express your dreams and aspirations in German"
    ],
    nursing_note: "Ich moechte in Deutschland als Krankenpflegerin arbeiten und meine Ausbildung erfolgreich abschliessen - this is your goal. Now you can say it in German.",
    mastery_pass_score: 80
  }
];

// Create data directory if it doesn't exist
if (!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

// Write each lesson as a separate file
lessons.forEach(lesson => {
  const filename = `data/${lesson.id}.json`;
  fs.writeFileSync(filename, JSON.stringify(lesson, null, 2));
  console.log(`Created: ${filename}`);
});

// Write a curriculum index file
const index = lessons.map(l => ({
  id: l.id,
  title: l.title,
  level: l.level,
  chapter: l.chapter,
  grammar_topic: l.grammar_topic
}));
fs.writeFileSync('data/curriculum-index.json', JSON.stringify(index, null, 2));
console.log(`Created: data/curriculum-index.json`);
console.log(`Done. ${lessons.length} lessons created.`);