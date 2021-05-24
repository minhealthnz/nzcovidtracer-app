### Code Quality

This code-base is available open-source to the general public, it is important that all developers working on this project do their best to write high-quality code that is testable, scalable, and follows software development best practices.

#### Code style
- We will be using TypeScript for all our React components
- Install prettier on your code editor
- Run yarn lint often to check for linting rules

#### Structure
- Write tests for all code relating to reducers/state manipulation
- Unless absolutely necessary do not use any (TypeScript)
- Follow the project folder structure, place files where they belong
- We will be using functional components
- For consistency, use hooks whenever possible. for e.g. Use useDispatch instead of redux HOC

#### Styles
- No inline styles. Use styled-components whenever possible
- Limit custom styles (including styled-components) in views, try to extract component whenever possible
- Use font sizes, colors, etc from constants
- Use our @components/atoms/Text component only, do not use the default Text from react-native (we have custom text styles applied by default)
