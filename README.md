## Social Media Clone Backend

This project is a backend implementation for a social media clone application using NestJS. It supports functionalities like user authentication, profile management, posting content, commenting, liking posts, and managing friend requests.

### Features

- **Authentication**: User signup and login.
- **Profile Management**: Update user profiles.
- **Post Management**: Create, update, delete, and view posts.
- **Comments**: Add,edit and delete comments.
- **Likes**: Like/unlike posts.
- **Friend Requests**: Send, accept, or decline friend requests.
- **Database Seeding**: Seed fake data for testing.

### Project Structure

- **Filters**: Handle exceptions globally.
- **Pipes**: Validate data (e.g., `SignupValidationPipe`, `UpdateUserValidationPipe`).
- **Modules**:
  - **Comment**: DTOs, entities, controller, service.
  - **Post**: DTOs, entities, controller, service.
  - **Friend-Request**: DTOs, entities, controller, service.
  - **User**: Guards, DTOs, entities, strategy, controller, service.
- **Reusable Components**: DTOs, entities, services.
- **Database Seeder**: Seed initial data.
- **Decorators**: Custom decorators like `UserDecorator`.
- **Enums**: `UserGenderEnum`: Enum for user gender.



