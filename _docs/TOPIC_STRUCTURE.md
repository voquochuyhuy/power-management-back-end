# Topics Messaging for Communication bw Device and Message Broker

## Communication Workflow

- Device --> Message Broker
- Message Broker <--> Device

## Structures

1. Data Topic Syntax: `dt/<app-name>/<context>/<client-id>/<dt-type>`

---

**dt**: prefix to the type of message
**app-name**: application identifier associated with the device
**context**: additional contextual data about the msg a device is publishing: geo, group, floor, ..
**client-id**: identifies which device is send a msg
**dt-type**: (*Optional*) For multiple subcomponents of a complex device

---

Ex: => `dt/power-mgmt/gigamall-l6-itec/ARD-01`

2. Command Template:

Request : `cmd/<app-name>/<context>/<destination-id>/<req-type>`
Response: `cmd/<app-name>/<context>/<destination-id>/<res-type>`

Ex: => ``

## Scenario

1. Data

- Health: `dt/
- Sensor Value

2. Commands

- Request and Response

## Current Implementation

### Publish

#### Topic `<client-id>/STA`

Payload

```
```

#### Topic: `<client-id>/HEART`

Payload

```
```

### Subscribe

#### Topic: `<client-id>/CMD`

## API

`PUT /api/v1/board/:id/toggle-all`
`PUT /api/v1/board/:id/toggle/:pinNumber`
