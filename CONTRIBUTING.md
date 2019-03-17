Contributing
----------------------------------

1. File an issue to notify the maintainers about what you're working on.
2. Fork the repo, develop and test your code changes, add docs.
3. Make sure that your commit messages clearly describe the changes.
4. Send a pull request.

File an Issue
----------------------------------

Use the issue tracker to start the discussion. It is possible that someone
else is already working on your idea, your approach is not quite right, or that
the functionality exists already. The ticket you file in the issue tracker will
be used to hash that all out.

Style Guides
-------------------
1. Use modular architecture to group similar functions, classes, etc.
2. Always use 2 spaces for indentation (don't use tabs)
3. Use double quote for string
4. Class names should always be capitalized
5. Function names should always be lowercase
6. Look at the existing style and adhere accordingly

Fork the Repository
-------------------

Be sure to add the relevant tests before making the pull request.
Is not mandatory, but is appreciated to have an example of your changes in `demo/` folder.
Docs will be updated automatically when we merge to master, but you should also build the docs yourself and make sure they're readable.


Sending a Pull Request
---------------------

1. Fork the repository and create your branch from master.
2. Run `yarn install` in the repository root.
3. If you’ve fixed a bug or added code that should be tested, add tests!
4. Run `yarn test` to run test suite.

Be sure to reference the original issue in the pull request.
Expect some back-and-forth with regards to style and compliance of these
rules.