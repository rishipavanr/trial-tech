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
    "id": "D1",
    "t": "Write a python program using a function to print fibonacci series up to n numbers",
    "starter": "def fib(n):\n    num1 = 0\n    num2 = 1\n    next_number = num2\n    count = 2\n    print(num1, num2, end=\" \")\n    while count <= n:   # BUG 1: Should be < n to avoid extra number\n        print(next_number, end=\" \")\n        count += 1\n        num1, num2 = num2, next_number\n        next_number = num1 + num2\n\nn = int(input(\"enter the Limit: \"))\nfib(n)\nprint()",
    "correct": "def fib(n):\n    if n == 0:\n        return\n    num1 = 0\n    num2 = 1\n    if n == 1:\n        print(num1)\n        return\n    print(num1, num2, end=\" \")\n    count = 2\n    while count < n:\n        next_number = num1 + num2\n        print(next_number, end=\" \")\n        count += 1\n        num1, num2 = num2, next_number\n\nn = int(input(\"enter the Limit: \"))\nfib(n)\nprint()",
    "expected": "ZW50ZXIgdGhlIExpbWl0OiAxMAowIDEgMSAyIDMgNSA4IDEzIDIxIDM0IDU1IDg5IA==",
    "mockInputs": ["10"]
  },
  {
    "id": "D2",
    "t": "Write a python program to enter two integers and perform all arithmetic operations on them.",
    "starter": "num1 = int(input(\"Enter first number: \"))\nnum2 = int(input(\"Enter second number: \"))\n\nprint(\"Printing the result for all arithmetic operations:-\")\nprint(\"Addition: \", num1+num2)\nprint(\"Subtraction: \", num1-num2)\nprint(\"Multiplication: \", num1*num2)\nprint(\"Division: \", num1/num2)   # BUG 1: Division by zero if num2=0\nprint(\"Modulus: \", num1%num2)     # BUG 2: Modulus by zero if num2=0",
    "correct": "num1 = int(input(\"Enter first number: \"))\nnum2 = int(input(\"Enter second number: \"))\n\nprint(\"Printing the result for all arithmetic operations:-\")\nprint(\"Addition: \", num1+num2)\nprint(\"Subtraction: \", num1-num2)\nprint(\"Multiplication: \", num1*num2)\nif num2 != 0:\n    print(\"Division: \", num1/num2)\n    print(\"Modulus: \", num1%num2)\nelse:\n    print(\"Division: Cannot divide by zero\")\n    print(\"Modulus: Cannot divide by zero\")",
    "expected": "RW50ZXIgZmlyc3QgbnVtYmVyOiAxMApFbnRlciBzZWNvbmQgbnVtYmVyOiAzClByaW50aW5nIHRoZSByZXN1bHQgZm9yIGFsbCBhcml0aG1ldGljIG9wZXJhdGlvbnM6LQpBZGRpdGlvbjogIDEzClN1YnRyYWN0aW9uOiAgNwpNdWx0aXBsaWNhdGlvbjogIDMwCkRpdmlzaW9uOiAgMy4zMzMzMzMzMzMzMzM1Ck1vZHVsdXM6ICAx",
    "mockInputs": ["10", "3"]
  },
  {
    "id": "D3",
    "t": "Write a Python program to accept length and width of a rectangle and compute its perimeter and area.",
    "starter": "length = float(input(\"Enter length of the rectangle: \"))\nbreadth = float(input(\"Enter breadth of the rectangle: \"))\n\narea = length * breadth\nperimeter = 2 * (length * breadth)   # BUG: Should be 2*(length + breadth)\n\nprint(\"Area of rectangle = \", area)\nprint(\"Perimeter of rectangle = \", perimeter)",
    "correct": "length = float(input(\"Enter length of the rectangle: \"))\nbreadth = float(input(\"Enter breadth of the rectangle: \"))\n\narea = length * breadth\nperimeter = 2 * (length + breadth)\n\nprint(\"Area of rectangle = \", area)\nprint(\"Perimeter of rectangle = \", perimeter)",
    "expected": "RW50ZXIgbGVuZ3RoIG9mIHRoZSByZWN0YW5nbGU6IDUKRW50ZXIgYnJlYWR0aCBvZiB0aGUgcmVjdGFuZ2xlOiAzCkFyZWEgb2YgcmVjdGFuZ2xlID0gIDE1LjAKUGVyaW1ldGVyIG9mIHJlY3RhbmdsZSA9ICAxNi4w",
    "mockInputs": ["5", "3"]
  },
  {
    "id": "D4",
    "t": "Write a Menu driven program in python to find factorial, and sum of natural Numbers using a function",
    "starter": "def fact(n):\n    return 1 if (n==1 or n==0) else n * fact(n-1)\ndef sum_n(n):\n    return 0 if (n==0) else n + sum_n(n-1)\nnum = int(input(\"Enter any number: \"))\nprint(\"1-To find the factorial, 2-To find the sum 3-Exit\")\nopt=int(input(\"Enter the option 1-3 \"))\nif (opt==1):\n    print(\"Factorial of \",num,\"is : \",fact(num))\nelse:\n    if(opt==2):\n        print(\"Sum of \",num,\"is : \",sum_n(num))\n    else:\n        print(\" \")\n# BUG 1: No handling for negative numbers (infinite recursion)\n# BUG 2: Option 3 prints a space instead of exiting",
    "correct": "def fact(n):\n    if n < 0:\n        return None\n    return 1 if (n==1 or n==0) else n * fact(n-1)\ndef sum_n(n):\n    if n < 0:\n        return None\n    return 0 if (n==0) else n + sum_n(n-1)\nnum = int(input(\"Enter any number: \"))\nprint(\"1-To find the factorial, 2-To find the sum 3-Exit\")\nopt=int(input(\"Enter the option 1-3 \"))\nif (opt==1):\n    if num < 0:\n        print(\"Factorial not defined for negative numbers\")\n    else:\n        print(\"Factorial of \",num,\"is : \",fact(num))\nelif (opt==2):\n    if num < 0:\n        print(\"Sum not defined for negative numbers\")\n    else:\n        print(\"Sum of \",num,\"is : \",sum_n(num))\nelse:\n    print(\"Exiting...\")",
    "expected": "RW50ZXIgYW55IG51bWJlcjogNQoxLVRvIGZpbmQgdGhlIGZhY3RvcmlhbCwgMi1UbyBmaW5kIHRoZSBzdW0gMy1FeGl0CkVudGVyIHRoZSBvcHRpb24gMS0zIDEKRmFjdG9yaWFsIG9mICA1IGlzIDogMTIw",
    "mockInputs": ["5", "1"]
  },
  {
    "id": "D5",
    "t": "Write a program that prints minimum and maximum of five numbers entered by the user.",
    "starter": "smallest = 0\nlargest = 0\nfor a in range(0,5):\n    x = int(input(\"Enter the number: \"))\n    if a == 0:\n    smallest = largest = x   # BUG 1: Indentation error\n    if(x < smallest):        # BUG 2: Indentation error (should be inside loop)\n        smallest = x\n    if(x > largest):\n        largest = x\nprint(\"The smallest number is\",smallest)\nprint(\"The largest number is \",largest)",
    "correct": "smallest = 0\nlargest = 0\nfor a in range(5):\n    x = int(input(\"Enter the number: \"))\n    if a == 0:\n        smallest = largest = x\n    else:\n        if x < smallest:\n            smallest = x\n        if x > largest:\n            largest = x\nprint(\"The smallest number is\", smallest)\nprint(\"The largest number is\", largest)",
    "expected": "RW50ZXIgdGhlIG51bWJlcjogNDUKRW50ZXIgdGhlIG51bWJlcjogMjMKRW50ZXIgdGhlIG51bWJlcjogNjcKRW50ZXIgdGhlIG51bWJlcjogMTIKRW50ZXIgdGhlIG51bWJlcjogODkKVGhlIHNtYWxsZXN0IG51bWJlciBpcyAxMgpUaGUgbGFyZ2VzdCBudW1iZXIgaXMgODk=",
    "mockInputs": ["45", "23", "67", "12", "89"]
  },
  {
    "id": "D6",
    "t": "Write a python program to add and display elements from a stack using list",
    "starter": "stack = []\nprint(\"initially stack is empty :\",stack)\nstack.append('x')\nstack.append('y')\nstack.append('z')\nprint(\"After PUSHING stack is :\")\nprint(stack)\nprint(\"After POPed from stack: \")\nprint(stack.pop())\nprint(stack.pop())\nprint(\"any stack after elements are poped:\")\nprint(stack)   # BUG: Stack still has 'x', but output suggests empty? Actually it prints ['x']",
    "correct": "stack = []\nprint(\"initially stack is empty :\",stack)\nstack.append('x')\nstack.append('y')\nstack.append('z')\nprint(\"After PUSHING stack is :\")\nprint(stack)\nprint(\"After POPed from stack: \")\nprint(stack.pop())\nprint(stack.pop())\nprint(\"any stack after elements are poped:\")\nprint(stack)",
    "expected": "aW5pdGlhbGx5IHN0YWNrIGlzIGVtcHR5IDogW10KQWZ0ZXIgUFVTSElORyBzdGFjayBpcyA6ClsneCcsICd5JywgJ3onXQpBZnRlciBQT1BlZCBmcm9tIHN0YWNrOiAKenkKQWZ0ZXIgUE9QZWQgZnJvbSBzdGFjazogCnkvCgphbnkgc3RhY2sgYWZ0ZXIgZWxlbWVudHMgYXJlIHBvcGVkOgpbeF0=",
    "mockInputs": []
  }
    ]
  }
};