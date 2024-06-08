# VIDEO-MORPH

Video morph is tool that allows users to transcode videos, enabling them adjust resolutions and also convert videos from one form to another to ensure compatibility across different devices.



## Project Summary 
 
The goal of this project is to develop a web-based platform that allows users to transcode their videos into  various formats and resolutions optimized for different devices and platforms (web, mobile, smart TVs, etc.).


To achieve this, the main goal is to handle everything involved in transcoding which are:

 

·         Transcoding: converting the formats from one form to another to ensure compatibility across devices

·         Transizing: changing the size to ensure compatibility and adaptability

·         Transrating: changing the bitrates, to ensure adaptability whenever there are changes in bandwidth.




## Project Specification



·         Stack : JavaScript (Frontend and backend)

·         Must be fully responsive across different devices

·         All states must be handled efficiently

·         Handle Authentication effectively (sign in, signup and sign out) and also implement Google authentication.

 

## Functional Requirements
 

Use of the FFMPEG software to transcode videos from one format inputted by users to their desired formats in order to ensure that regardless of their bandwidth, they always have access to videos.

Also, ensuring that every user that signs up have their information recorded using either firebase or our own custom backend database.

 Technical Requirements and Limitations
Describe all the system requirements for this project. Document each component. A component could be the application container, the persistence layer, a caching component, a job, external services, UI layers, or anything else.

 

This section should also contain details on one or more of the following:

●         API endpoints and links to their schemas

●         Third-party dependencies

●         Traffic and capacity requirements

●         Testing requirements

 


## Technical requirements needed for this project include

 

·         Video Transcoding Engine i.e. FFMPEG

·         User Management (user authentication with secure password storage) & (user roles and permission management for controlling access to transcoding features and user data)

·         File upload and Storage or conversion of link for videos (support for uploading large videos, integration with cloud storage services to store videos, file management features such as file deletion, renaming and organization)

·         Task queue and background processing

·         API design and documentation (if needed)

·         Create a pixel perfect, interactive and intuitive user interface

·         Logging mechanism for tracking system activities, errors and user actions

·         Implementation of best practices for securing user data, authentication tokens and API endpoints




## Limitations

 

·         Processing time:

·         Scalability issues (but most likely no need to bother about it since it is not a commercial scale project)

·         Complexity issues involved in integrating third party software or APIs

·         Ensuring compatibility with several devices and browsers e.g Safari.

·         Third party software or API’s reliability would have effect on the performance of the project
