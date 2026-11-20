// Site-wide details. Replace the bracketed placeholders.
export const site = {
  name: 'sidelong',
  author: 'John DeLong',
  intro: 'In my spare hours I build small, careful apps for the people around me. This is where they live.',
  // The doors on the home page. x is left/right and d is distance back, in px on the floor.
  // A place without an href is shown but not yet open.
  places: [
    { label: 'Software', sub: 'Eight apps so far', href: '/apps', colors: '#FFC9A3 0%, #FF8266 34%, #F2599C 64%, #7C4DE0 100%', x: 0, d: 240, big: true },
    { label: '[A hobby]', sub: '[One line about it]', href: '', colors: '#FFE0A8, #FFB347 40%, #FF6B5E', x: -520, d: 480, big: false },
    { label: '[Another hobby]', sub: '[One line about it]', href: '', colors: '#C8F0D8, #5CC8A0 45%, #2F8F9D', x: 540, d: 440, big: false },
    { label: '[A third hobby]', sub: '[One line about it]', href: '', colors: '#D9C8FF, #9B6BFF 45%, #4BA3F5', x: -260, d: 880, big: false },
    { label: 'About me', sub: 'Who is behind this', href: '/about', colors: '#FFD9E4, #FF8FB0 45%, #C4365F', x: 340, d: 920, big: false },
  ],
  contact: [
    { label: '[your email]', href: '#' },
    { label: 'GitHub', href: 'https://github.com/johndelong' },
    { label: '[LinkedIn]', href: '#' },
  ],
}
