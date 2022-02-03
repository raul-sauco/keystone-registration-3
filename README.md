# Keystone Registration

The public frontend for Keystone Adventures.

This web application is directed to participants of Keystone Adventures trips. The application has a double purpose, let participants access the latest trip information online, and let them register for the trips, gathering required data, and letting them complete the required steps remotely.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

To generate a new component in its own module with routing, for example, a module called hello-world:

1. `ng g module pages/hello-world --routing`
2. `ng g component pages/payments --module=hello-world`

To generate a new sub-component that will only be used in one module, for example a section of a page, use:

`ng g component pages/hello-world/morning --module=hello-world`

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Regular expressions can be used to only run some tests from the command line, for example `ng test --include='**/home.component.spec.ts'` to only run the _home component's_ tests. More complex commands are also possible, for example `ng test --include='src/app/pages/*/{faq,home}.component.spec.ts'` to test the _faq_ and _home_ components. [source here][1].

`ng test --no-watch` to only run the tests once and return to the command line prompt.

### Providing test dependencies

#### Missing routes

If the test already imports `RouterTestingModule` but it still fails because of a missing route:

The router method can be mocked as seen [here][2], probably the best option.

```typescript
spyOn(component.router, "navigate").and.returnValue(lastValueFrom(of(true)));
```

Or a route can be configured directly on the import, as seen [here][3].

```TypeScript
RouterTestingModule.withRoutes([
  { path: 'trip-codes', component: TripCodesComponent },
]),
```

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

[1]: https://stackoverflow.com/a/63088940/2557030
[2]: https://stackoverflow.com/a/47201928/2557030
[3]: https://stackoverflow.com/a/56565810/2557030
