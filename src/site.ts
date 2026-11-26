// Site-wide details. Replace the bracketed placeholders.
export const site = {
  name: 'sidelong',
  author: 'John DeLong',
  intro: 'In my spare hours I build small, careful apps for the people around me. This is where they live.',
  // The doors on the home page, in the order they come round the ring.
  // A place without an href is shown but not yet open. ink: dark text, for doors with light colours.
  places: [
    { label: 'Software', href: '/apps', colors: '#FFC9A3 0%, #FF8266 34%, #F2599C 64%, #7C4DE0 100%' },
    { label: 'Making', href: '', colors: '#FFE0A8, #FFB347 40%, #FF6B5E', ink: true },
    { label: 'Photography', href: '', colors: '#C8F0D8, #5CC8A0 45%, #2F8F9D', ink: true },
    { label: 'Odds & ends', href: '', colors: '#D9C8FF, #9B6BFF 45%, #4BA3F5' },
    { label: 'About', href: '/about', colors: '#FFD9E4, #FF8FB0 45%, #C4365F', ink: true },
  ],
  contact: [
    { label: '[your email]', href: '#' },
    { label: 'GitHub', href: 'https://github.com/johndelong' },
    { label: '[LinkedIn]', href: '#' },
  ],
}
