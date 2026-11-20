---
name: RF MQTT Discovery
order: 8
gradient: '#9B6BFF, #4BA3F5'
glyph: '<circle cx="14" cy="34" r="2.5"/><path d="M14 23a11 11 0 0 1 11 11M14 12a22 22 0 0 1 22 22"/>'
summary: A Home Assistant app that turns the 433 MHz sensors around the house into Home Assistant devices, but only the ones you approve.
tagline: Brings cheap 433 MHz sensors into Home Assistant automatically, without picking up every sensor on the street.
chips:
  - For Home Assistant users
  - Home Assistant app
  - Python
  - Open source
link:
  label: View on GitHub
  href: https://github.com/johndelong/home-assistant-rf-mqtt-discovery
features:
  - title: Approve before it appears
    body: Unknown sensors stay pending. Turn on pairing mode, trigger the new sensor, and it's approved only after its signal repeats enough times.
  - title: Stable devices
    body: Each device's ID comes from its rtl_433 model and identifier, and discovery is republished whenever Home Assistant restarts.
  - title: Honest battery state
    body: Sensors that only report whether the battery is OK show up as a low-battery warning, not a made-up battery percentage.
---

[What you were trying to automate, and why you went with 433 MHz sensors.]

[The moment you realised you were picking up the neighbours' sensors too.]

[How it's running at home now.]
