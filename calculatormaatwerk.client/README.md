# CalculatorMaatwerk Client

## Table of Contents
- [Overview](#overview)
- [Introduction](#introduction)
- [Features](#features)
- [Project Structure](#projectstructure)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Building the Project](#building-the-project)
- [Running Tests](#running-tests)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Modules](#modules)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview
This project is an Angular application designed to provide a customizable and interactive user interface for configuring and managing window sill products. It leverages Angular Material for UI components and ngx-translate for internationalization.

## Introduction
CalculatormaatwerkClient is an Angular application designed to provide a customizable and interactive user interface for configuring and managing window sill products. This project leverages Angular Material for UI components and ngx-translate for internationalization.

## Features
- Customizable calculation modules
- User-friendly interface
- Real-time calculation updates
- Support for various mathematical operations

## Project Structure
```bash
calculatormaatwerk.client/
├── .angular/
├── .vscode/
├── src/
│   ├── app/
│   │   ├── configurator/
│   │   │   ├── configurator.component.ts
│   │   │   ├── configurator.component.html
│   │   │   ├── configurator.component.css
│   │   ├── products/
│   │   ├── models/
│   │   ├── directives/
│   │   ├── app.module.ts
│   │   ├── app-routing.module.ts
│   ├── assets/
│   ├── environments/
│   ├── main.ts
│   ├── index.html
│   ├── styles.css
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── custom-theme.scss
├── README.md
├── CHANGELOG.md
```

## Installation
To install the CalculatorMaatwerk Client, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://Coeck-NV@dev.azure.com/Coeck-NV/Calculator%20Maatwerk/_git/Calculator%20Maatwerk
    ```
2. Navigate to the project directory:
    ```bash
    cd calculatormaatwerk.client
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

## Usage
To start the application, run:
```bash
npm start
```
Open your browser and navigate to `http://localhost:3000` to access the application.

## Development
To start the development server, run:
```bash
ng serve
```
Navigate to `http://localhost:4200/` to view the application. The app will automatically reload if you change any of the source files.

## Building the Project
To build the project, run:
```bash
ng build
```
The build artifacts will be stored in the `dist/` directory.

## Running Tests
### Unit Tests
To execute the unit tests via Karma, run:
```bash
ng test
```

### End-to-End Tests
To execute the end-to-end tests via a platform of your choice, run:
```bash
ng e2e
```
Note: You need to first add a package that implements end-to-end testing capabilities.

## Deployment
The project is configured to be deployed to Azure Static Web Apps. The deployment pipeline is defined in the `build-and-publish.yml` file.

## Configuration
### Environment Configuration
Environment-specific configurations are located in the `src/environments/` directory. The `angular.json` file defines file replacements for different build configurations.

### Theming
Custom theming for Angular Material is defined in `custom-theme.scss`.

### Internationalization
The project uses ngx-translate for internationalization. Translation files are located in the `src/assets/i18n/` directory.

## Modules
### Configurator Module
- **File**: `src/app/configurator/configurator.component.ts`
- **Description**: Handles the configuration of window sill products.
- **Link to Main Application**: Declared in the AppModule and routed via the AppRoutingModule.

### Products Module
- **File**: `src/app/products/`
- **Description**: Manages product data and interactions.
- **Link to Main Application**: Imported into the AppModule.

### Models Module
- **File**: `src/app/models/`
- **Description**: Contains TypeScript interfaces and classes for data models.
- **Link to Main Application**: Used across the application for type safety.

### Directives Module
- **File**: `src/app/directives/`
- **Description**: Contains custom directives for DOM elements.
- **Link to Main Application**: Declared in the AppModule.

### App Module
- **File**: `src/app/app.module.ts`
- **Description**: Root module of the application.
- **Link to Main Application**: Bootstraps the AppComponent.

### App Routing Module
- **File**: `src/app/app-routing.module.ts`
- **Description**: Defines the routes for the application.
- **Link to Main Application**: Configures navigation paths.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any questions or feedback, please contact [yourname@yourdomain.com](mailto:yourname@yourdomain.com).

