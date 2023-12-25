import fs from 'fs';
export interface user {
  authUserId: number,
  nameFirst: string,
  nameLast: string,
  password: string,
  email: string,
  numSuccessfulLogins: number,
  numFailedPasswordsSinceLastLogin: number,
  quizIds: Array< number >,
  tokenIds: Array< string >,
  previousPasswords: Array< string >
}

export interface answer {
  answerId: number,
  answer: string,
  colour: string,
  correct: boolean
}

export interface answerId {
  answerId: Array < number >
}

export interface answerBody {
  answer: string,
  correct: boolean
}

export interface question {
  questionId: number,
  question: string,
  duration: number,
  thumbnailUrl: string,
  points: number,
  answers: Array< answer >
}

export interface questionBody {
  question: string,
  duration: number,
  points: number,
  answers: Array< answerBody >,
  thumbnailUrl: string
}

export interface quiz {
  quizId: number,
  name: string,
  timeCreated: number,
  timeLastEdited: number,
  description: string,
  numQuestions: number,
  questions: Array< question >,
  quizOwnerId: number,
  quizPlayers: Array<number>,
  duration: number,
  thumbnailUrl: string
}

export interface message {
  messageBody: string,
  playerId: number
  playerName: string
  timeSent: number
}

interface questionResult {
  questionId: number,
  playersCorrectList: Array<string>,
  averageAnswerTime: number,
  percentCorrect: number
}

export interface session {
  sessionId: number,
  quizId: number,
  autoStartNum: number,
  sessionOwnerId: number,
  sessionPlayersId: Array<number>,
  state: string
  userRankedByScore?: Array<{name: string, score: number}>,
  questionResults?: Array<questionResult>
  atQuestion: number,
  messages?: Array <message>
}
// two interfaces for Error where made
export interface Error {
  error: string
}

export interface ERROR {
  error: string
}

export type EmptyObject = Record<string, never>;


/*
let data = {

  users: [
    {
      authUserId: 1,
      nameFirst: 'John',
      nameLast: 'Doe',
      password: 'qwerty',
      email: 'JohnDoe@gmail.com',
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 0,
      quizIds: [1, 3],
      tokenIds: ['abc', 'cda'],
      previousPasswords: ['carsA9']
    },
    {
      authUserId: 2,
      nameFirst: 'Jane',
      nameLast: 'Doe',
      password: 'qwertyuiop',
      email: 'JaneDoe@gmail.com',
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 0,
      quizIds: [],
      tokenIds: [],
      previousPasswords: ['carsA9']
    }
  ],
  quizzes: [
    {
      quizId: 1,
      name: 'Dogs',
      timeCreated: 1683125870,
      timeLastEdited: 1683125871,
      description: 'Different dog breeds',
      numQuestions: 1,
      questions: [
        {
          questionId: 5546,
          question: 'Who is the Monarch of England?',
          duration: 4,
          thumbnailUrl: "http://google.com/some/image/path.jpg",
          points: 5,
          answers: [
            {
              answerId: 2384,
              answer: 'Prince Charles',
              colour: 'red',
              correct: true
            }
          ]
        },
      ],
      quizOwnerId: 1,
      quizPlayers: [1],
      duration: 44,
      thumbnailUrl: "http://google.com/some/image/path.jpg",
      sessions: [
        {
          sessionId: 1,
          quizId: 1,
          autoStartNum: 0,
          sessionOwnerId: 1,
          sessionPlayersId: [1, 2],
          state: 'OPEN'
        },
      ]
    },
  ],
  quizzesTrash: [
    {
      quizId: 2,
      name: 'Cats',
      timeCreated: 1683125870,
      timeLastEdited: 1683125871,
      description: 'Different cat breeds',
      numQuestions: 1,
      questions: [
        {
          questionId: 5546,
          question: 'Who is the Monarch of france?',
          duration: 4,
          thumbnailUrl: "http://google.com/some/image/path.jpg",
          points: 5,
          answers: [
            {
              answerId: 2384,
              answer: 'Prince Charles',
              colour: 'blue',
              correct: true
            }
          ]
        },
      ],
      quizOwnerId: 2,
      quizPlayers: [2],
      duration: 44,
      thumbnailUrl: "http://google.com/some/image/path.jpg",
      sessions: [
        {
          sessionId: 2,
          quizId: 1,
          autoStartNum: 2,
          sessionOwnerId: 1,
          sessionPlayersId: [1, 2],
          state: 'END'
        }
      ]
    },
  ],
  sessions: [
    {
      sessionId: 1,
      quizId: 1,
      autoStartNum: 0,
      sessionOwnerId: 1,
      sessionPlayersId: [1, 2],
      state: 'OPEN'
    },
    {
      sessionId: 2,
      quizId: 1,
      autoStartNum: 2,
      sessionOwnerId: 1,
      sessionPlayersId: [1, 2],
      state: 'END'
    }
  ]
}; 
*/


// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return JSON.parse(String(fs.readFileSync('database.json')));
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: any) {
  fs.writeFileSync('database.json', JSON.stringify(newData));
}

export { getData, setData };
