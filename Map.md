
**Interfaces (and implementations):**

`RandomNumberGenerator` - generates random integers:
 * `RandomNumberGeneratorImpl_Crypto`  - generates random integers using Node.js `crypto` library

`ChoiceGenerator` - generates a computer's game choice signed with a hash:
 * `ComputerChoiceGenerator` - the only implementation;

`GameView` - renders data and handles user input to the controller:
 * `GameViewImpl_CLI` - renders data using console, uses Inquirer library to interact with a user;
 * `GameViewImpl_REST` - creates an Express router and renders data using JSON responses;

`ScoreStorage` - stores the scoreboard:
 * `ScoreStorageImpl_Memory`;
 * `ScoreStorageImpl_Redis`;

**Classes:**

`GameController`: the only class that implements game logic and does not depend on the implementation (CLI or REST)
