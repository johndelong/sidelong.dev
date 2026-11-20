---
name: Rhys
order: 3
summary: Our household assistant. One brain that knows our home, and as many ways to talk to it as we need, built to keep our family's information at home.
tagline: A household assistant any family could name. Ours is Rhys.
gradient: '#7FD1C1, #3B7DD8'
glyph: '<circle cx="24" cy="25" r="6"/><circle cx="10" cy="11" r="3"/><circle cx="38" cy="11" r="3"/><circle cx="24" cy="41" r="2.5"/><path d="M12.5 13.5l7 7M35.5 13.5l-7 7M24 31v7.5"/>'
chips:
  - For our household
  - Voice & text
  - Local-first
  - Python
goalsTitle: Two rules it's built around
goals:
  - title: It knows who's asking.
    body: Personal information is kept separate from what anyone in the house can hear, and privileged actions only happen when the right person is there.
  - title: It stays home.
    body: His memory and our household's data live on our own hardware, for the same reason we use Home Assistant and Immich. The thinking happens in the cloud for now, because the models I can run at home aren't yet good enough for my family, but switching to a local one is a setting, not a rebuild.
features:
  - title: One brain, many satellites
    body: The brain holds the memory, the tools and the state of the house. Satellites are just ways to reach it, a web page with a microphone, a chat, a phone line, and each one is a thin layer with no conversation logic of its own.
  - title: A voice layer that can't make things up
    body: Between the microphone and the brain there's only transcription and a wake phrase. The voice layer handles turn-taking and interruptions, but every answer comes from the brain.
  - title: Careful about what it does by voice
    body: Voice recognition isn't perfect, so some features are limited when you're talking rather than typing.
---

Rhys is our name for him. What I'm actually building is an assistant any household could have, and the name is just whatever you give it.

The idea is simple. There's one brain, which knows our family and our home and can take action. Then there are satellites, which are just ways to reach it. You can type to it, talk to it, or one day call it on the phone. It doesn't matter which, because they all lead to the same brain. The brain runs on Hermes, an open agent I host at home. What I've built is everything around it: the voice engine, the satellites, and a phone line that's paused for now while I rebuild it.

The hardest part has been voice. I want to talk to Rhys the way I'd talk to a person, with no awkward pauses, and have him follow along when more than one of us is in the conversation. Speech-to-speech voice models sound wonderfully human, but they come with their own brain, separate from the one that actually knows our household. Getting the two to work together without one of them confidently making something up is a problem I haven't solved yet. For now Rhys transcribes what you say, thinks, and then speaks. It's accurate, but you can hear the wait.

My girls helped me test his speaker recognition. My oldest asked, "Who am I?" and Rhys confidently named our two-year-old. They thought it was hilarious, and so did I, but it's also exactly why who's talking matters. Rhys keeps personal information separate from what anyone in the house can hear, privileged actions need the right person present, and since voice recognition can still get it wrong, some features are limited when you're talking rather than typing.

Today I'm his main user, and mostly by typing. A lot of my side projects get started that way: I describe what I want from the road and Rhys builds it, including the site for our family's fantasy football league.

My wife doesn't use him yet. She's a little wary of how much he knows, which is fair. I think what will change that isn't Rhys knowing more. It's Rhys solving a real problem for her, like groceries, reminders or keeping track of spending, and being on her phone when she isn't home. That's the next step: earning a place in her day.
