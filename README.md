![whisker_white copy](https://github.com/user-attachments/assets/1239b653-0483-4f94-bd19-318e31ecf887)

Deployed Live at: https://whisker-omega.vercel.app/

## Demo: Whisker is a cat product company trying to convince blog viewers to buy more products

<img width="2531" alt="arch3" src="https://github.com/user-attachments/assets/053c661f-f733-429c-9f38-da381201709f" />



## Tools Used
* `Twilio Segment` – customer-data platform: collects events, unifies user profiles, and routes them to any downstream tool for personalized engagement.
* `Twilio SendGrid` – cloud email service: delivers transactional & marketing emails with templating, analytics, and high deliverability.
* `Twilio Conversations API` – multi-channel messaging layer: builds 1-to-1 or group threads across SMS, WhatsApp, and chat with webhooks and history.
* `Twilio Flex` – fully programmable cloud contact center: integrates voice, chat, SMS, and CRM data in a customizable agent desktop.
* `Twilio Verify` – turnkey OTP service: generates and delivers one-time codes over SMS, email, or WhatsApp and handles fraud controls.
* `Vercel` – serverless hosting & CI/CD platform optimized for frontend frameworks with global edge network and instant rollbacks.
* `NextJS` – React meta-framework that adds file-based routing, API routes, SSR/SSG, and edge functions for full-stack web apps.
* `Neon Postgres` – serverless Postgres with branchable databases, autoscaling, and a generous free tier, ideal for modern cloud apps.
* `Redux` – predictable state-management library for JavaScript/React apps, using a single global store and pure reducer function*


#### Features

<img width="1257" alt="Screenshot 2025-04-27 at 11 00 04 PM" src="https://github.com/user-attachments/assets/1e4ad79d-26bb-4cdd-a9db-8267efe035ca" />

This app allows profile analytics to be tracked, recorded, and sent to segment, which in turn sends well timed advertisements via text and email, as well as change featured products on screen based on viewed categories of posts. The user will also get messages when they abandon their cart for an hour and when they spend more than $300. Users can also contact support through flex. 

## Analytics Panel
The analytics panel shows all events being sent to segment, which are stored in local storage through a middlewear for the analytics api. 

<img width="1362" alt="Screenshot 2025-05-03 at 2 07 14 AM" src="https://github.com/user-attachments/assets/137e9d82-17bc-4b45-a0cb-6cb24cbae5e4" />

## Two Factor Authentication (Twilio Verify)
<img width="762" alt="Screenshot 2025-05-03 at 1 58 17 AM" src="https://github.com/user-attachments/assets/eaaedb99-c23e-4384-8d4c-a70608744c8e" />

## SMS (Twilio Conversations Api)
<img width="409" alt="Screenshot 2025-05-03 at 1 57 08 AM" src="https://github.com/user-attachments/assets/248415e1-8c58-4a54-ad66-d6703b5804e5" />

## Email (Twilio SendGrid)
<img width="1340" alt="Screenshot 2025-05-03 at 1 57 41 AM" src="https://github.com/user-attachments/assets/af221166-9073-4de8-ae07-a267a8f795c5" />

## Live Support (Twilio Flex)
<img width="353" alt="Screenshot 2025-05-03 at 2 00 07 AM" src="https://github.com/user-attachments/assets/c06b1b24-cdaa-4453-8fa6-cf5f31b82d77" />

## Data Tracking (Twilio Segment)

#### Webhooks
<img width="1081" alt="Screenshot 2025-05-03 at 2 04 26 AM" src="https://github.com/user-attachments/assets/a200acd4-a4df-4715-882f-a4bfd65e52b3" />

#### Computed Traits
<img width="751" alt="Screenshot 2025-05-03 at 2 03 28 AM" src="https://github.com/user-attachments/assets/544bd3cf-5638-4719-a107-fbb656b43ef8" />

#### Audiences
<img width="836" alt="Screenshot 2025-05-03 at 2 03 39 AM" src="https://github.com/user-attachments/assets/34bb7c7d-0875-4831-b124-cb9d3d9eaa8f" />

#### Journeys
<img width="888" alt="Screenshot 2025-05-03 at 2 03 54 AM" src="https://github.com/user-attachments/assets/f4e04241-a9f2-4c15-b2df-d4097056783c" />
