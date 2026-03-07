# DevTinder APIs

## authRouter

- POST /signup
- POST /login
- POST /logout
- POST /forgot-password // Public password reset (no auth required)

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/forgotPassword // Change password (requires login)
- POST /profile/upload-photo // Upload profile picture (multipart/form-data, field: photo)

## connectionRequestRouter

- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

## userRouter

- GET /user/requests/received
- GET /user/connections
- GET /user/feed // Paginated feed – ?page=1&limit=10

Status: ignored, interested, accepted, rejected

## Static Files

- GET /uploads/:filename // Serve uploaded profile pictures
