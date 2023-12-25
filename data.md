```javascript
const data = {
    user: [
        {
            authUserid: 1,
            nameFirst: 'Doe',
            nameLast: 'John',
            password: 'qwerty043',
            email: 'JohnDoe@gmail.com',
            numFailedPasswordsSinceLastLogin: 0,
            quizIds: [1,3],
        },
        {
            authUserid: 2,
            nameFirst: 'Biswas',
            nameLast: 'Simkhada',
            password: '12345678',
            email: 'biswasIsTheBoss@gmail.com',
            numFailedPasswordsSinceLastLogin: 100000,
            quizIds: [],
        },
    ],

    quiz: [
        {
            ownerUserId: 1,
            quizId: 1,
            name: 'Dogs',
            description: 'Different dog breeds',
        },
        {
            ownerUserId: 3,
            quizId: 1,
            name: 'Cats',
            description: 'Different cat breeds',
        },
    ],
}
```

[Optional] short description: Template of data structure, all variable names reflect the project function lists' parameters and return values. Comprised of a set of arrays for users and quizes where each user will have an array of quizes they created assigned to them.
