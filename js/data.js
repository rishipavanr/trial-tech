/* TECH TRIVIA — js/data.js — exported 9/1/2026, 1:18:43 PM */
window.TT_DATA = {
  "version": 1,
  "brand": {
    "event": "TECH TRIVIA",
    "org": "Department of IT"
  },
  "settings": {
    "keys": {
      "r2": "R0FMQVhZMjY=",
      "r3": "TkVCVUxBMjY=",
      "r4": "Q09ERUJVUlNUMjY=",
      "debug": "REVCVUcyNlQ=",
      "r1_tb": "VGllLTAx",
      "r2_tb": "VGllLTAy",
      "r3_tb": "VGllLTAz",
      "r4_tb": "VGllLTA0"
    },
    "durations": {
      "r1": 15,
      "r2": 10,
      "r3": 15,
      "r4": 20,
      "tiebreak": 1
    },
    "bonusCap": {
      "r1": 0,
      "r2": 0,
      "r3": 0
    },
    "points": {
      "crossword": 10,
      "r4task": 10,
      "debug": 20,
      "puzzle": 3
    },
    "r4RequiredTasks": 1,
    "r4CodingMinutes": 15,
    "r4DebugMinutes": 5
  },
  "demos": {
    "r1": {
      "type": "mcq",
      "t": "What is 2 + 2 in Python?",
      "o": [
        "22",
        "4",
        "2+2",
        "Error"
      ],
      "a": 1
    },
    "r2": {
      "type": "puzzle",
      "t": "DEMO: Identify this company from its logo.",
      "imgs": [
        "assets/logo-instagram.png"
      ],
      "hint": "Starts with I - a photo-sharing app.",
      "a": "instagram"
    },
    "r3": {
      "type": "puzzle",
      "t": "DEMO: Guess the tech word.",
      "imgs": [
        "☁️",
        "💾",
        "🌩️",
        "📁"
      ],
      "hint": "Your files live here, not on your desk.",
      "a": "cloud"
    },
    "r4": {
      "type": "code",
      "t": "DEMO: Print exactly: Hello, Demo!",
      "expected": "Hello, Demo!"
    },
    "tiebreak": {
      "type": "mcq",
      "t": "DEMO: CSS stands for:",
      "o": [
        "Computer Style Sheets",
        "Cascading Style Sheets",
        "Creative Style System",
        "Coded Style Sheets"
      ],
      "a": 1
    }
  },
  "r1": [
    {
      "id": "p1",
      "t": "What is the output of print(2 ** 3 ** 2)?",
      "o": [
        "64",
        "512",
        "256",
        "128"
      ],
      "a": "MQ=="
    },
    {
      "id": "p2",
      "t": "Which of these is mutable in Python?",
      "o": [
        "tuple",
        "string",
        "list",
        "frozenset"
      ],
      "a": "Mg=="
    },
    {
      "id": "p3",
      "t": "What does len({1, 2, 2, 3, 3, 3}) return?",
      "o": [
        "6",
        "3",
        "5",
        "Error"
      ],
      "a": "MQ=="
    },
    {
      "id": "p4",
      "t": "What is the output of print('5' + '5')?",
      "o": [
        "10",
        "55",
        "Error",
        "5.0"
      ],
      "a": "MQ=="
    },
    {
      "id": "p5",
      "t": "What does the id() function return?",
      "o": [
        "Data type",
        "Memory address of object",
        "Index",
        "Length"
      ],
      "a": "MQ=="
    },
    {
      "id": "p6",
      "t": "What is the output of print(bool('False'))?",
      "o": [
        "True",
        "False",
        "Error",
        "None"
      ],
      "a": "MA=="
    },
    {
      "id": "p7",
      "t": "Which keyword handles exceptions in Python?",
      "o": [
        "catch",
        "except",
        "rescue",
        "handle"
      ],
      "a": "MQ=="
    },
    {
      "id": "p8",
      "t": "What will [1, 2, 3] + [4, 5] return?",
      "o": [
        "[5, 7]",
        "[1, 2, 3, 4, 5]",
        "Error",
        "[1, 2, 3, [4, 5]]"
      ],
      "a": "MQ=="
    },
    {
      "id": "p9",
      "t": "What is the output of print(10 // 3)?",
      "o": [
        "3.33",
        "3",
        "4",
        "3.0"
      ],
      "a": "MQ=="
    },
    {
      "id": "p10",
      "t": "Which creates a shallow copy of list a?",
      "o": [
        "b = a",
        "b = a[:]",
        "b = a.copy(deep=True)",
        "b = list(a, deep=True)"
      ],
      "a": "MQ=="
    },
    {
      "id": "s1",
      "t": "Which SQL clause filters groups after aggregation?",
      "o": [
        "WHERE",
        "HAVING",
        "GROUP BY",
        "FILTER"
      ],
      "a": "MQ=="
    },
    {
      "id": "s2",
      "t": "Which command removes a table's structure AND data entirely?",
      "o": [
        "DELETE",
        "TRUNCATE",
        "DROP",
        "REMOVE"
      ],
      "a": "Mg=="
    },
    {
      "id": "s3",
      "t": "What does the DISTINCT keyword do?",
      "o": [
        "Sorts results",
        "Removes duplicate rows",
        "Groups rows",
        "Filters NULLs"
      ],
      "a": "MQ=="
    },
    {
      "id": "s4",
      "t": "Correct way to find rows where manager_id is NULL?",
      "o": [
        "WHERE manager_id = NULL",
        "WHERE manager_id == NULL",
        "WHERE manager_id IS NULL",
        "WHERE manager_id <> NULL"
      ],
      "a": "Mg=="
    },
    {
      "id": "s5",
      "t": "Primary difference between DELETE and TRUNCATE?",
      "o": [
        "TRUNCATE uses WHERE",
        "DELETE is DDL",
        "DELETE logs each row; TRUNCATE is faster",
        "No difference"
      ],
      "a": "Mg=="
    },
    {
      "id": "s6",
      "t": "Which JOIN returns all left rows + matched right rows?",
      "o": [
        "INNER JOIN",
        "RIGHT JOIN",
        "LEFT JOIN",
        "CROSS JOIN"
      ],
      "a": "Mg=="
    },
    {
      "id": "s7",
      "t": "Which function returns the number of rows in a result?",
      "o": [
        "SUM()",
        "COUNT()",
        "TOTAL()",
        "ROWS()"
      ],
      "a": "MQ=="
    },
    {
      "id": "s8",
      "t": "What does ORDER BY salary DESC LIMIT 1 return?",
      "o": [
        "Lowest salary",
        "Highest salary",
        "All rows",
        "Error"
      ],
      "a": "MQ=="
    },
    {
      "id": "s9",
      "t": "Which of these is a valid aggregate function?",
      "o": [
        "AVG()",
        "MID()",
        "LEN()",
        "SPLIT()"
      ],
      "a": "MA=="
    },
    {
      "id": "s10",
      "t": "Output of SELECT 10 % 3;",
      "o": [
        "3.33",
        "1",
        "3",
        "Error"
      ],
      "a": "MQ=="
    },
    {
      "id": "g1",
      "t": "What does CPU stand for?",
      "o": [
        "Central Processing Unit",
        "Computer Personal Unit",
        "Central Program Utility",
        "Control Processing Unit"
      ],
      "a": "MA=="
    },
    {
      "id": "g2",
      "t": "Which of these is an INPUT device?",
      "o": [
        "Monitor",
        "Keyboard",
        "Printer",
        "Speaker"
      ],
      "a": "MQ=="
    },
    {
      "id": "g3",
      "t": "What does RAM stand for?",
      "o": [
        "Read Access Memory",
        "Random Access Memory",
        "Rapid Access Module",
        "Read Anywhere Memory"
      ],
      "a": "MQ=="
    },
    {
      "id": "g4",
      "t": "Which company makes the iPhone?",
      "o": [
        "Samsung",
        "Google",
        "Apple",
        "Microsoft"
      ],
      "a": "Mg=="
    },
    {
      "id": "g5",
      "t": "What does 'www' stand for in a website address?",
      "o": [
        "World Wide Web",
        "Western Web Works",
        "Web World Wide",
        "World Web Wire"
      ],
      "a": "MA=="
    },
    {
      "id": "g6",
      "t": "Which of these is a web browser?",
      "o": [
        "Windows",
        "Python",
        "Google Chrome",
        "Microsoft Word"
      ],
      "a": "Mg=="
    },
    {
      "id": "g7",
      "t": "What does USB stand for?",
      "o": [
        "Universal Serial Bus",
        "United System Bus",
        "Universal System Board",
        "Unified Serial Board"
      ],
      "a": "MA=="
    },
    {
      "id": "g8",
      "t": "Which key combination is used to COPY selected text?",
      "o": [
        "Ctrl + V",
        "Ctrl + X",
        "Ctrl + C",
        "Ctrl + Z"
      ],
      "a": "Mg=="
    },
    {
      "id": "g9",
      "t": "What is the full form of PDF?",
      "o": [
        "Portable Document Format",
        "Public Data File",
        "Personal Document Folder",
        "Portable Digital Format"
      ],
      "a": "MA=="
    },
    {
      "id": "g10",
      "t": "Wi-Fi stands for:",
      "o": [
        "Wireless Fidelity",
        "Wired Fidelity",
        "Wide Fiber",
        "Wireless Finder"
      ],
      "a": "MA=="
    }
  ],
  "tieBreakers": {
    "r1": {
      "key": "VGllLTAx",
      "questions": [
        {
          "id": "tb_r1_1",
          "t": "Which language is known as the 'language of the web'?",
          "o": [
            "Python",
            "Java",
            "JavaScript",
            "C++"
          ],
          "a": "Mg=="
        },
        {
          "id": "tb_r1_2",
          "t": "What does HTTP stand for?",
          "o": [
            "HyperText Transfer Protocol",
            "High Transfer Text Protocol",
            "HyperText Technical Process",
            "Home Tool Transfer Protocol"
          ],
          "a": "MA=="
        },
        {
          "id": "tb_r1_3",
          "t": "Which company developed Android OS?",
          "o": [
            "Apple",
            "Microsoft",
            "Google",
            "Samsung"
          ],
          "a": "Mg=="
        },
        {
          "id": "tb_r1_4",
          "t": "Binary representation of decimal 5?",
          "o": [
            "100",
            "101",
            "110",
            "111"
          ],
          "a": "MQ=="
        },
        {
          "id": "tb_r1_5",
          "t": "Who is known as the father of the computer?",
          "o": [
            "Alan Turing",
            "Charles Babbage",
            "Bill Gates",
            "Steve Jobs"
          ],
          "a": "MQ=="
        }
      ]
    },
    "r2": {
      "key": "VGllLTAy",
      "questions": [
        {
          "id": "tb_r2_1",
          "t": "Which data structure follows the LIFO principle ?",
          "img": null,
          "o": [
            "QUEUE",
            "STACK",
            "ARRAY",
            "LINKED LIST"
          ],
          "a": "MQ=="
        },
        {
          "id": "tb_r2_2",
          "t": "Which of them is not a valid SQL aggregate function ?",
          "img": null,
          "o": [
            "SUM()",
            "AVG()",
            "COUNT()",
            "TOTAL()"
          ],
          "a": "Mw=="
        },
        {
          "id": "tb_r2_3",
          "t": "Dummy Question 3 for Corporate Clue Tiebreaker?",
          "o": [
            "Option A",
            "Option B",
            "Option C",
            "Option D"
          ],
          "a": "MA=="
        },
        {
          "id": "tb_r2_4",
          "t": "Dummy Question 4 for Corporate Clue Tiebreaker?",
          "o": [
            "Option A",
            "Option B",
            "Option C",
            "Option D"
          ],
          "a": "MA=="
        },
        {
          "id": "tb_r2_5",
          "t": "Dummy Question 5 for Corporate Clue Tiebreaker?",
          "o": [
            "Option A",
            "Option B",
            "Option C",
            "Option D"
          ],
          "a": "MA=="
        }
      ]
    },
    "r3": {
      "key": "VGllLTAz",
      "questions": [
        {
          "id": "tb_r3_1",
          "t": "What AI bot word has 4 letters and starts with 'Q' and ends with 'N' (AI)?",
          "img": null,
          "a": "UVdFTg=="
        },
        {
          "id": "tb_r3_2",
          "t": "Name the most popular open-source OS with a penguin mascot.",
          "a": "TGludXg="
        },
        {
          "id": "tb_r3_3",
          "t": "What is the smallest unit of digital data (0 or 1)?",
          "img": null,
          "o": [
            "bit",
            "binary",
            "byte",
            "none"
          ],
          "a": "MA=="
        },
        {
          "id": "tb_r3_4",
          "t": "Full form of 'AGI' in modern tech?",
          "img": null,
          "a": "QXJ0aWZpY2lhbCBHZW5lcmFsIEludGVsbGlnZW5jZQ=="
        },
        {
          "id": "tb_r3_5",
          "t": "What word describes malicious software like viruses and trojans?",
          "img": null,
          "o": [
            "Malware",
            "Antivirus",
            "Virus",
            "MCsafe"
          ],
          "a": "MA=="
        }
      ]
    },
    "r4": {
      "key": "VGllLTA0",
      "questions": [
        {
          "id": "tb_r4_1",
          "t": "Output of: print(len('Python'))",
          "expected": "Ng=="
        },
        {
          "id": "tb_r4_2",
          "t": "Output of: print('hello'.upper())",
          "expected": "SEVMTE8="
        },
        {
          "id": "tb_r4_3",
          "t": "Output of: print(100 // 7)",
          "expected": "MTQ="
        },
        {
          "id": "tb_r4_4",
          "t": "Output of: print(sum([1,2,3,4,5]))",
          "expected": "MTU="
        },
        {
          "id": "tb_r4_5",
          "t": "Output of: print('Python'[0])",
          "expected": "UA=="
        }
      ]
    }
  },
  "r2": [
    {
      "id": "c1",
      "t": "Identify this company from its logo.",
      "img": "assets/logo-mysql.png",
      "a": "bXlzcWw=",
      "alt": [
        "bXkgc3Fs"
      ]
    },
    {
      "id": "c2",
      "t": "Identify this company from its logo.",
      "img": "assets/logo-deepseek.png",
      "a": "ZGVlcHNlZWs=",
      "alt": [
        "ZGVlcCBzZWVr"
      ]
    },
    {
      "id": "c3",
      "t": "Identify this company from its logo.",
      "img": "assets/logo-pinterest.png",
      "a": "cGludGVyZXN0"
    },
    {
      "id": "c4",
      "t": "Identify this company from its logo.",
      "img": "assets/logo-claude.png",
      "a": "Y2xhdWRl",
      "alt": [
        "Y2xhdWRlIGFp"
      ]
    },
    {
      "id": "c5",
      "t": "Identify this company from its logo.",
      "img": "assets/logo-wikipedia.png",
      "a": "d2lraXBlZGlh",
      "alt": [
        "d2lraQ=="
      ]
    },
    {
      "id": "c6",
      "t": "Identify this company from its logo.",
      "img": "assets/logo-firefox.png",
      "a": "ZmlyZWZveA==",
      "alt": [
        "bW96aWxsYSBmaXJlZm94"
      ]
    },
    {
      "id": "c7",
      "t": "Identify the company: \"Connecting People.\"",
      "a": "bm9raWE="
    },
    {
      "id": "c8",
      "t": "Identify the company: \"The Computer is Personal Again.\"",
      "a": "aHA="
    },
    {
      "id": "c9",
      "t": "Identify the company: \"Innovation that Matters.\"",
      "a": "bGVub3Zv"
    },
    {
      "id": "c10",
      "t": "Identify the company: \"Inspire the World, Create the Future.\"",
      "a": "c2Ftc3VuZw=="
    },
    {
      "id": "c11",
      "t": "Identify the company: \"Experience Amazing.\"",
      "a": "bGV4dXM="
    },
    {
      "id": "c12",
      "t": "Identify the company: \"Hello Moto.\"",
      "a": "bW90b3JvbGE="
    },
    {
      "id": "c13",
      "t": "Identify the company: \"Empowering the World with Technology.\"",
      "a": "bWljcm9zb2Z0",
      "alt": [
        "bXM="
      ]
    },
    {
      "id": "c14",
      "t": "Identify the company: \"Think Different.\"",
      "a": "YXBwbGU="
    },
    {
      "id": "c15",
      "t": "Identify the company: \"Intel Inside.\"",
      "a": "aW50ZWw="
    },
    {
      "id": "c16",
      "t": "Identify the company: \"Ideas for Life.\"",
      "a": "cGFuYXNvbmlj"
    },
    {
      "id": "c17",
      "t": "Unjumble the tech word: NEMCAIH GNRAELNI",
      "a": "bWFjaGluZSBsZWFybmluZw=="
    },
    {
      "id": "c18",
      "t": "Unjumble the tech word: GOMLARITH",
      "a": "YWxnb3JpdGht"
    },
    {
      "id": "c19",
      "t": "Unjumble the tech word: SEADABAT",
      "a": "ZGF0YWJhc2U="
    },
    {
      "id": "c20",
      "t": "Unjumble the tech word: OTROPCOL",
      "a": "cHJvdG9jb2w="
    },
    {
      "id": "c21",
      "t": "Unjumble the tech word: HCEAC",
      "a": "Y2FjaGU="
    },
    {
      "id": "c22",
      "t": "Unjumble the tech word: ZUALITRIVANOI",
      "a": "dmlydHVhbGl6YXRpb24="
    },
    {
      "id": "c23",
      "t": "Unjumble the tech word: RTAONCINE",
      "a": "Y29udGFpbmVy"
    },
    {
      "id": "c26",
      "t": "Which company's logo is a bitten apple?",
      "a": "YXBwbGU="
    },
    {
      "id": "c27",
      "t": "CEO of Tesla and SpaceX?",
      "a": "ZWxvbiBtdXNr",
      "alt": [
        "ZWxvbg==",
        "bXVzaw=="
      ]
    }
  ],
  "r3": [
    {
      "id": "v1",
      "img": [
        "assets/q1 i1.jpeg",
        "assets/q1 i2.jpeg",
        "assets/q1 i3.jpeg",
        "assets/q1 i4.jpeg"
      ],
      "hint1": "“It travels around Earth.\"",
      "hint2": "“It helps us communicate, navigate, and collect information from space.\"",
      "clue": "Placeholder 1 : A machine sent into space to collect information or communicate",
      "a": "U2F0ZWxsaXRl"
    },
    {
      "id": "v2",
      "img": [
        "assets/q2 i1.jpeg",
        "assets/q2 i2.jpeg",
        "assets/q2 i3.jpeg",
        "assets/q2 i4.jpeg"
      ],
      "hint1": "Related to the internet",
      "hint2": "You use it to access websites",
      "clue": "Placeholder 2 :  A system of websites and web pages accessed through the internet",
      "a": "V29ybGQgd2lkZSB3ZWI="
    },
    {
      "id": "v3",
      "img": [
        "assets/q3 i1.jpeg",
        "assets/q3 i2.jpeg",
        "assets/q3 i3.jpeg",
        "assets/q3 i4.jpeg"
      ],
      "hint1": "It keeps digital threats out.",
      "hint2": "It inspects every piece of incoming and outgoing network traffic.",
      "clue": "Placeholder 3 : A security system that blocks unwanted network access",
      "a": "RmlyZXdhbGw="
    },
    {
      "id": "v4",
      "img": [
        "assets/q4 i1.jpeg",
        "assets/q4 i2.jpeg",
        "assets/q4 i3.jpeg",
        "assets/q4 i4.jpeg"
      ],
      "hint1": "Named after a 10th-century Nordic king",
      "hint2": "A short-range wireless standard that lets your headphones, phone, and mouse.",
      "clue": "Placeholder 4 : A technology used to connect devices wirelessly over short distances",
      "a": "Qmx1ZXRvb3Ro"
    },
    {
      "id": "v5",
      "img": [
        "assets/q5 i1.jpeg",
        "assets/q5 i2.jpeg",
        "assets/q5 i3.jpeg",
        "assets/q5 i4.jpeg"
      ],
      "hint1": "Machines can learn and make decisions",
      "hint2": "GPT is an example of this technology",
      "clue": "Placeholder 5 : Technology that enables computers to learn, reason, and perform tasks like humans",
      "a": "QXJ0aWZpY2lhbCBJbnRlbGxpZ2VuY2U="
    },
    {
      "id": "v6",
      "img": [
        "assets/q6 i1.jpeg",
        "assets/q6 i2.jpeg",
        "assets/q6 i3.jpeg",
        "assets/q6 i4.jpeg"
      ],
      "hint1": "Protects information",
      "hint2": "Important for online security",
      "clue": "Placeholder 6",
      "a": "RW5jcnlwdGlvbg=="
    },
    {
      "id": "v7",
      "img": [
        "assets/q7 i1.jpeg",
        "assets/q7 i2.jpeg",
        "assets/q7 i3.jpeg",
        "assets/q7 i4.jpeg"
      ],
      "hint1": "Used in server and PC",
      "hint2": "Its mascot is a penguin",
      "clue": "Placeholder 7",
      "a": "TGludXg="
    },
    {
      "id": "v8",
      "img": [
        "assets/q8 i1.jpeg",
        "assets/q8 i2.jpeg",
        "assets/q8 i3.jpeg",
        "assets/q8 i4.jpeg"
      ],
      "hint1": "Information is stored in linked blocks",
      "hint2": "Used by cryptocurrencies",
      "clue": "Placeholder 8 : A digital record system that stores information in linked blocks",
      "a": "QmxvY2sgY2hhaW4="
    },
    {
      "id": "v9",
      "img": [
        "assets/q9 i1.jpeg",
        "assets/q9 i2.jpeg",
        "assets/q9 i3.jpeg",
        "assets/q9 i4.jpeg"
      ],
      "hint1": "It helps your computer run multiple programs at the same time",
      "hint2": "It is a type of temporary memory used by computers",
      "clue": "Placeholder 9 : Temporary computer memory that helps programs run quickly",
      "a": "UkFN"
    },
    {
      "id": "v10",
      "img": [
        "assets/q10 i1.jpeg",
        "assets/q10 i2.jpeg",
        "assets/q10 i3.jpeg",
        "assets/q10 i4.jpeg"
      ],
      "hint1": "“It creates a computer-generated world you can experience.\"",
      "hint2": "\"You can explore it without physically being there.”",
      "clue": "Placeholder 10 : Technology that creates an immersive computer generated virtual world",
      "a": "VlI="
    },
    {
      "id": "v11",
      "img": [
        "assets/q11 i1.jpeg",
        "assets/q11 i2.jpeg",
        "assets/q11 i3.jpeg",
        "assets/q11 i4.jpeg"
      ],
      "hint1": "“It connects everyday physical devices to the internet.”",
      "hint2": "“Smart watches, smart homes, and connected cars.\"",
      "clue": "Placeholder 11 : A system where everyday physical devices connect to the internet",
      "a": "SW50ZXJuZXQgT2YgVGhpbmdz"
    },
    {
      "id": "v12",
      "img": [
        "assets/q12 i1.jpeg",
        "assets/q12 i2.jpeg",
        "assets/q12 i3.jpeg",
        "assets/q12 i4.jpeg"
      ],
      "hint1": "“I can be found in both nature and software.\"",
      "hint2": "“Developers try to find and fix me.\"",
      "clue": "Placeholder 12 :  An error or problem in a computer program that needs to be fixed",
      "a": "QnVn"
    },
    {
      "id": "v13",
      "img": [
        "assets/q13 i1.jpeg",
        "assets/q13 i2.jpeg",
        "assets/q13 i3.jpeg",
        "assets/q13 i4.jpeg"
      ],
      "hint1": "“I make smartphones, TVs, and many other electronics.\"",
      "hint2": "“My smartphones are part of a famous series called Galaxy.\"",
      "clue": "Placeholder 13 : A technology company famous for Galaxy smartphones and electronics",
      "a": "U2Ftc3VuZw=="
    },
    {
      "id": "v14",
      "img": [
        "assets/q14 i1.jpeg",
        "assets/q14 i2.jpeg",
        "assets/q14 i3.jpeg",
        "assets/q14 i4.jpeg"
      ],
      "hint1": "“I am India’s organization responsible for space exploration.”",
      "hint2": "\"Chandrayaan and Mangalyaan are some of the famous missions associated with me.\"",
      "clue": "Placeholder 14: India’s space organization responsible for missions involving rockets and satellites",
      "a": "SVNSTw=="
    },
    {
      "id": "v15",
      "img": [
        "assets/q15 i1.jpeg",
        "assets/q15 i2.jpeg",
        "assets/q15 i3.jpeg",
        "assets/q15 i4.jpeg"
      ],
      "hint1": "I help you understand data and numbers.",
      "hint2": "I turn raw data into useful insights.",
      "clue": "Placeholder 15: I turn raw data into useful insights.",
      "a": "QW5hbHl0aWNz"
    }
  ],
  "r4": {
    "tasks": [
      {
        "id": "t1",
        "t": "Write a Python program that counts the frequency of each element in this list:\nnumbers = [2, 3, 2, 4, 3, 2]\n\nPrint each element and its count on separate lines in the format: \"element -> count\"\nPrint elements in the order they first appear in the list.\n\nExpected output:\n2 -> 3\n3 -> 2\n4 -> 1",
        "expected": "MiAtPiAzCjMgLT4gMgo0IC0+IDE="
      },
      {
        "id": "t2",
        "t": "Write a Python program that moves all zeros in this list to the end, while keeping the order of non-zero elements unchanged:\nnumbers = [0, 5, 0, 3, 2, 0, 8]\n\nPrint the resulting list elements separated by spaces on one line.\n\nExpected output:\n5 3 2 8 0 0 0",
        "expected": "NSAzIDIgOCAwIDAgMA=="
      },
      {
        "id": "t3",
        "t": "Write a Python program that finds the second largest number in this list:\nnumbers = [10, 25, 8, 45, 32]\n\nPrint only the second largest number.\n\nExpected output:\n32",
        "expected": "MzI="
      },
      {
        "id": "t4",
        "t": "Write a Python program that finds the missing number in this sequence. The list contains numbers from 1 to N, but one number is missing:\nnumbers = [1, 2, 3, 5, 6]\n\nPrint the missing number.\n\nExpected output:\n4",
        "expected": "NA=="
      },
      {
        "id": "t5",
        "t": "Write a Python program that finds the duplicate number in this list. The list contains numbers from 1 to N with exactly one number appearing twice:\nnumbers = [1, 3, 4, 2, 2]\n\nPrint the duplicate number.\n\nExpected output:\n2",
        "expected": "Mg=="
      }
    ],
    "debug": [
      {
        "id": "A12",
        "t": "Write a python program using function to search an element in a list using binary search method.",
        "starter": "def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low < high:  # BUG 1: Should be <= not < (misses last element check)\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\ndef input_list():\n    arr = []\n    n = int(input(\"Enter the number of elements in the list: \"))\n    for i in range(n):\n        element = int(input(\"Enter the elements in ascending order \"))\n        arr.append(element)\n    return arr\n\narr = input_list()\ntarget = int(input(\"Enter the element to search for: \"))\n\nresult = binary_search(arr, target)\nif result != 1:  # BUG 2: Should be != -1, not != 1 (wrong condition)\n    print(target, \"Element found at index\", result)\nelse:\n    print(target, \"Element not found in the list.\")\n# BUG 3: Missing handling when element at index 0 is found\n# BUG 4: No validation that list is sorted\n# BUG 5: No error handling for empty list\n# BUG 6: Variable name 'left' and 'right' used instead of 'low' and 'high' in some versions",
        "correct": "def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\ndef input_list():\n    arr = []\n    n = int(input(\"Enter the number of elements in the list: \"))\n    for i in range(n):\n        element = int(input(\"Enter the elements in ascending order \"))\n        arr.append(element)\n    return arr\n\narr = input_list()\ntarget = int(input(\"Enter the element to search for: \"))\n\nresult = binary_search(arr, target)\nif result != -1:\n    print(target, \"Element found at index\", result)\nelse:\n    print(target, \"Element not found in the list.\")",
        "expected": "RW50ZXIgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgbGlzdDogNQpFbnRlciB0aGUgZWxlbWVudHMgaW4gYXNjZW5kaW5nIG9yZGVyIDEyCkVudGVyIHRoZSBlbGVtZW50cyBpbiBhc2NlbmRpbmcgb3JkZXIgMjMKRW50ZXIgdGhlIGVsZW1lbnRzIGluIGFzY2VuZGluZyBvcmRlciAzNApFbnRlciB0aGUgZWxlbWVudHMgaW4gYXNjZW5kaW5nIG9yZGVyIDQ1NApFbnRlciB0aGUgZWxlbWVudHMgaW4gYXNjZW5kaW5nIG9yZGVyIDY1NgpFbnRlciB0aGUgZWxlbWVudCB0byBzZWFyY2ggZm9yOiAzNAozNCBFbGVtZW50IGZvdW5kIGF0IGluZGV4IDI=",
        "mockInputs": [
          "5",
          "12",
          "23",
          "34",
          "454",
          "656",
          "34"
        ]
      },
      {
        "id": "A9",
        "t": "Write a python program using function to sort the elements of a list using selection sort method",
        "starter": "def selection_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        min_index = i\n        for j in range(i+1, n):\n            if arr[j] < arr[min_index]:\n                min_index = j\n        arr[i], arr[min_index] = arr[min_index], arr[i]\n\ndef input_list():\n    arr = []\n    n = int(input(\"Enter the number of elements in the list: \"))\n    for i in range(n):\n        element = int(input(\"Enter element \"))\n        arr.append(element)\n    return arr\n\narr = input_list()\n\nprint(\"Original list:\", arr)\n\nselection_sort(arr)\nprint(\"Sorted list using insertion sort method:\", arr)\n# BUG 1: Output message says \"insertion sort\" instead of \"selection sort\"\n# BUG 2: No return statement in selection_sort (works but unclear)\n# BUG 3: No validation for empty list\n# BUG 4: No validation for non-integer inputs\n# BUG 5: Range could be optimized to n-1 instead of n\n# BUG 6: No check if min_index != i before swapping (unnecessary swap)",
        "correct": "def selection_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        min_index = i\n        for j in range(i+1, n):\n            if arr[j] < arr[min_index]:\n                min_index = j\n        arr[i], arr[min_index] = arr[min_index], arr[i]\n\ndef input_list():\n    arr = []\n    n = int(input(\"Enter the number of elements in the list: \"))\n    for i in range(n):\n        element = int(input(\"Enter element \"))\n        arr.append(element)\n    return arr\n\narr = input_list()\n\nprint(\"Original list:\", arr)\n\nselection_sort(arr)\nprint(\"Sorted list:\", arr)",
        "expected": "RW50ZXIgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgbGlzdDogNQpFbnRlciBlbGVtZW50IDMyCkVudGVyIGVsZW1lbnQgNDUKRW50ZXIgZWxlbWVudCA2NwpFbnRlciBlbGVtZW50IDM0CkVudGVyIGVsZW1lbnQgMjMKT3JpZ2luYWwgbGlzdDogWzMyLCA0NSwgNjcsIDM0LCAyM10KU29ydGVkIGxpc3Q6IFsyMywgMzIsIDM0LCA0NSwgNjdd",
        "mockInputs": [
          "5",
          "32",
          "45",
          "67",
          "34",
          "23"
        ]
      },
      {
        "id": "A7-PICKLE",
        "t": "Write a python program to copy the records of the students having percentage 90 and above from the binary file into another file.",
        "starter": "import pickle\n\nwhile True:\n    print(\"    1. Create Binary File.\")\n    print(\"    2. Display the main File.\")\n    print(\"    3. Create new file with >90\")\n    print(\"    4. Exit\")\n    a = int(input('choose a command (1-2,9-exit): '))\n    \n    if a == 1:\n        f = open('student.dat', 'wb')\n        o = open('stuii.dat', 'wb')\n        x = int(input('How many student: '))\n        for i in range(x):\n            name = input('Name: ')\n            english = int(input('English Mark: '))\n            lan = int(input('Language Marks: '))\n            phy = int(input('Physics Mark: '))\n            chem = int(input('Chemistry Mark: '))\n            maths = int(input('Maths Mark: '))\n            cs = input('CS Mark: ')  # BUG 1: Missing int() conversion\n            total = phy + chem + cs + maths + english + lan  # BUG 2: Type error with cs\n            per = (total / 600) * 100\n            t = [name, english, lan, phy, chem, maths, cs, total, per]\n            pickle.dump(t, f)\n            if per >= 90:\n                pickle.dump(t, o)\n        f.close()\n        o.close()\n    elif a == 2:\n        f = open('student.dat', 'rb')\n        try:\n            while True:\n                p = pickle.load(f)\n                print(p)\n        except:\n            f.close()  # BUG 3: File not closed in finally block\n    elif a == 3:\n        print(\"Students with > 90 Marks\")\n        f = open('stuii.dat', 'rb')\n        try:\n            while True:\n                o = pickle.load(f)\n                print(o)\n        except:\n            f.close()  # BUG 4: File not closed in finally block\n    else:\n        break\n# BUG 5: No EOFError exception handling (bare except)\n# BUG 6: Files not closed properly on exception\n# BUG 7: No validation for marks range (0-100)\n# BUG 8: Variable 'o' used for both file handle and record (naming conflict)",
        "correct": "import pickle\n\nwhile True:\n    print(\"    1. Create Binary File.\")\n    print(\"    2. Display the main File.\")\n    print(\"    3. Create new file with >90\")\n    print(\"    4. Exit\")\n    a = int(input('choose a command (1-2,9-exit): '))\n    \n    if a == 1:\n        f = open('student.dat', 'wb')\n        o = open('stuii.dat', 'wb')\n        x = int(input('How many student: '))\n        for i in range(x):\n            name = input('Name: ')\n            english = int(input('English Mark: '))\n            lan = int(input('Language Marks: '))\n            phy = int(input('Physics Mark: '))\n            chem = int(input('Chemistry Mark: '))\n            maths = int(input('Maths Mark: '))\n            cs = int(input('CS Mark: '))\n            total = phy + chem + cs + maths + english + lan\n            per = (total / 600) * 100\n            t = [name, english, lan, phy, chem, maths, cs, total, per]\n            pickle.dump(t, f)\n            if per >= 90:\n                pickle.dump(t, o)\n        f.close()\n        o.close()\n    elif a == 2:\n        f = open('student.dat', 'rb')\n        try:\n            while True:\n                p = pickle.load(f)\n                print(p)\n        except:\n            f.close()\n    elif a == 3:\n        print(\"Students with > 90 Marks\")\n        f = open('stuii.dat', 'rb')\n        try:\n            while True:\n                o = pickle.load(f)\n                print(o)\n        except:\n            f.close()\n    else:\n        break",
        "expected": "TWVudToKMS4gQ3JlYXRlIEJpbmFyeSBGaWxlCjIuIERpc3BsYXkgdGhlIG1haW4gRmlsZQozLiBDcmVhdGUgbmV3IGZpbGUgd2l0aCA+OTAKNC4gRXhpdApDaG9vc2UgYSBjb21tYW5kICgxLTIsOS1leGl0KTogMQpIb3cgbWFueSBzdHVkZW50OiAyCk5hbWU6IEpvaG4KRW5nbGlzaCBNYXJrOiA5NQpMYW5ndWFnZSBNYXJrczogOTIKUGh5c2ljcyBNYXJrOiA4OApDaGVtaXN0cnkgTWFyazogOTEKTWF0aHMgTWFyazogOTQKQ1MgTWFyazogOTYKW1N0dWRlbnQgcmVjb3JkIGRpc3BsYXllZF0=",
        "mockInputs": [
          "1",
          "1",
          "John",
          "95",
          "92",
          "88",
          "91",
          "94",
          "96",
          "2",
          "3",
          "4"
        ]
      },
      {
        "id": "A11",
        "t": "Write a program to check whether an input number is a palindrome or not.",
        "starter": "n = int(input(\"Enter a number:\"))\ntemp = n\nreverse = 0\n\nwhile(n > 0):\n    digit = n % 10\n    reverse = reverse * 10 + digit\n    n = n // 10\n\nif(temp = reverse):  # BUG 1: Assignment (=) instead of comparison (==)\n    print(\"Palindrome\")\nelse:\n    print(\"Not a Palindrome\")\n# BUG 2: Doesn't handle negative numbers\n# BUG 3: Doesn't handle single digit numbers correctly (they are palindromes)\n# BUG 4: No validation for non-integer input\n# BUG 5: Variable 'temp' could be named more descriptively\n# BUG 6: No handling for number 0 (edge case)",
        "correct": "n = int(input(\"Enter a number:\"))\ntemp = n\nreverse = 0\n\nwhile(n > 0):\n    digit = n % 10\n    reverse = reverse * 10 + digit\n    n = n // 10\n\nif(temp == reverse):\n    print(\"Palindrome\")\nelse:\n    print(\"Not a Palindrome\")",
        "expected": "RW50ZXIgYSBudW1iZXI6IDEyMQpQYWxpbmRyb21lCgpFbnRlciBhIG51bWJlcjogMTIzCk5vdCBhIFBhbGluZHJvbWU=",
        "mockInputs": [
          "121"
        ]
      },
      {
        "id": "A3",
        "t": "Write a python program using user defined function to calculate interest amount using simple interest method and compound interest method and find the difference of interest amount between the two methods.",
        "starter": "def simpInt(principle, time, rate):\n    si = float(principle * time * rate / 100)\n    return si\n\ndef compInt(principle, time, rate):\n    ci = float(principle * ((1 + rate/100)**time - 1))\n    return ci\n\nprinciple = float(input('Enter amount: '))\ntime = float(input('Enter time: '))\nrate = float(input('Enter rate: '))\n\nsi = simpInt(principle, time, rate)\nci = compInt(principle, time, rate)\n\nprint('Simple interest is Rs. %8.2f' % si)\nprint('Compound interest is Rs. %8.2f' % ci)\ndiffInt = ci - si\nprint(\"Difference is Rs. %8.2f\" % diffInt)\n# BUG 1: No validation for negative values\n# BUG 2: No validation for zero or negative time\n# BUG 3: No validation for rate range\n# BUG 4: Formula assumes annual compounding (not specified)\n# BUG 5: No error handling for non-numeric inputs\n# BUG 6: Variable name 'principle' should be 'principal' (spelling)",
        "correct": "def simpInt(principle, time, rate):\n    si = float(principle * time * rate / 100)\n    return si\n\ndef compInt(principle, time, rate):\n    ci = float(principle * ((1 + rate/100)**time - 1))\n    return ci\n\nprinciple = float(input('Enter amount: '))\ntime = float(input('Enter time: '))\nrate = float(input('Enter rate: '))\n\nsi = simpInt(principle, time, rate)\nci = compInt(principle, time, rate)\n\nprint('Simple interest is Rs. %8.2f' % si)\nprint('Compound interest is Rs. %8.2f' % ci)\ndiffInt = ci - si\nprint(\"Difference is Rs. %8.2f\" % diffInt)",
        "expected": "RW50ZXIgYW1vdW50OiA0NTAwMApFbnRlciB0aW1lOiAzCkVudGVyIHJhdGU6IDEyLjUKU2ltcGxlIGludGVyZXN0IGlzIFJzLiAxNjg3NS4wMApDb21wb3VuZCBpbnRlcmVzdCBpcyBScy4gMTkwNzIuMjcKRGlmZmVyZW5jZSBpcyBScy4gMjE5Ny4yNw==",
        "mockInputs": [
          "45000",
          "3",
          "12.5"
        ]
      },
      {
        "id": "A7-MINMAX",
        "t": "Write a program that prints minimum and maximum of five numbers entered by the user.",
        "starter": "smallest = 0\nlargest = 0\n\nfor a in range(0, 5):\n    x = int(input(\"Enter the number: \"))\n    if a == 0:\n        smallest = largest = x\n    if(x < smallest):\n        smallest = x\n    if(x > largest):\n        largest = x\n\nprint(\"The smallest number is\", smallest)\nprint(\"The largest number is\", largest)\n# BUG 1: Initial values of smallest=0 and largest=0 are misleading\n# BUG 2: No validation for non-integer inputs\n# BUG 3: No handling if all numbers are negative\n# BUG 4: Should use elif for second condition (optimization)\n# BUG 5: No error handling for empty input\n# BUG 6: Variable 'a' could be named more descriptively (like 'i' or 'index')",
        "correct": "smallest = 0\nlargest = 0\n\nfor a in range(0, 5):\n    x = int(input(\"Enter the number: \"))\n    if a == 0:\n        smallest = largest = x\n    if(x < smallest):\n        smallest = x\n    if(x > largest):\n        largest = x\n\nprint(\"The smallest number is\", smallest)\nprint(\"The largest number is\", largest)",
        "expected": "RW50ZXIgdGhlIG51bWJlcjogNDUKRW50ZXIgdGhlIG51bWJlcjogMjMKRW50ZXIgdGhlIG51bWJlcjogNjcKRW50ZXIgdGhlIG51bWJlcjogMTIKRW50ZXIgdGhlIG51bWJlcjogODkKVGhlIHNtYWxsZXN0IG51bWJlciBpcyAxMgpUaGUgbGFyZ2VzdCBudW1iZXIgaXMgODk=",
        "mockInputs": [
          "45",
          "23",
          "67",
          "12",
          "89"
        ]
      },
      {
        "id": "A10",
        "t": "Write a program to find the sum of digits of an integer number, input by the user",
        "starter": "sum = 0\nn = int(input(\"Enter the number: \"))\n\nwhile n > 0:\n    digit = n % 10\n    sum = sum + digit\n    n = n // 10\n\nprint(\"The sum of digits of the number is\", sum)\n# BUG 1: Doesn't handle negative numbers (while loop won't execute)\n# BUG 2: Doesn't handle number 0 (returns sum=0, should be 0)\n# BUG 3: No validation for non-integer input\n# BUG 4: Variable name 'sum' shadows built-in function sum()\n# BUG 5: No handling for very large numbers\n# BUG 6: No validation for empty input",
        "correct": "sum = 0\nn = int(input(\"Enter the number: \"))\n\nwhile n > 0:\n    digit = n % 10\n    sum = sum + digit\n    n = n // 10\n\nprint(\"The sum of digits of the number is\", sum)",
        "expected": "RW50ZXIgdGhlIG51bWJlcjogMTIzNDUKVGhlIHN1bSBvZiBkaWdpdHMgb2YgdGhlIG51bWJlciBpcyAxNQ==",
        "mockInputs": [
          "12345"
        ]
      },
      {
        "id": "A4",
        "t": "Write a Python Program to read a text file and display the number of vowels, consonants, uppercase and lowercase characters in the file",
        "starter": "def count_characters(file_name):\n    vowels = \"aeiouAEIOU\"\n    vowel_count = 0\n    consonant_count = 0\n    uppercase_count = 0\n    lowercase_count = 0\n\n    with open(file_name, \"r\") as file:\n        text = file.read()\n\n    for char in text:\n        if char.isalpha():\n            if char in vowels:\n                vowel_count += 1\n            else:\n                consonant_count += 1\n\n        if char.isupper():\n            uppercase_count += 1\n        elif char.islower():\n            lowercase_count += 1\n\n    print(\"Vowels:\", vowel_count)\n    print(\"Consonants:\", consonant_count)\n    print(\"Uppercase characters:\", uppercase_count)\n    print(\"Lowercase characters:\", lowercase_count)\n\ndef create_text_file(file_name, content):\n    with open(file_name, \"w\") as file:\n        file.write(content)\n\nfile_name = \"sample.txt\"\ncontent = input(\"enter few sentences to create a text file with content: \")\ncreate_text_file(file_name, content)\n\ncount_characters(file_name)\n# BUG 1: No error handling if file doesn't exist\n# BUG 2: No validation for empty file\n# BUG 3: Counts digits and special chars as neither vowel nor consonant (correct but not mentioned)\n# BUG 4: No handling for non-ASCII characters\n# BUG 5: File mode \"r\" might fail on different encodings\n# BUG 6: No check if input content is empty",
        "correct": "def count_characters(file_name):\n    vowels = \"aeiouAEIOU\"\n    vowel_count = 0\n    consonant_count = 0\n    uppercase_count = 0\n    lowercase_count = 0\n\n    with open(file_name, \"r\") as file:\n        text = file.read()\n\n    for char in text:\n        if char.isalpha():\n            if char in vowels:\n                vowel_count += 1\n            else:\n                consonant_count += 1\n\n        if char.isupper():\n            uppercase_count += 1\n        elif char.islower():\n            lowercase_count += 1\n\n    print(\"Vowels:\", vowel_count)\n    print(\"Consonants:\", consonant_count)\n    print(\"Uppercase characters:\", uppercase_count)\n    print(\"Lowercase characters:\", lowercase_count)\n\ndef create_text_file(file_name, content):\n    with open(file_name, \"w\") as file:\n        file.write(content)\n\nfile_name = \"sample.txt\"\ncontent = input(\"enter few sentences to create a text file with content: \")\ncreate_text_file(file_name, content)\n\ncount_characters(file_name)",
        "expected": "ZW50ZXIgZmV3IHNlbnRlbmNlcyB0byBjcmVhdGUgYSB0ZXh0IGZpbGUgd2l0aCBjb250ZW50OiBIZWxsbyBXb3JsZCBQcm9ncmFtbWluZwpWb3dlbHM6IDYKQ29uc29uYW50czogMTUKVXBwZXJjYXNlIGNoYXJhY3RlcnM6IDMKTG93ZXJjYXNlIGNoYXJhY3RlcnM6IDE4",
        "mockInputs": [
          "Hello World Programming"
        ]
      }
    ]
  }
};