# Easter Eggs

Internal tracking for hidden interactions and placeholder cheat codes.

## Active

### Text lavalamp backdrop

- Status: active
- Location: `components/FluidBackdrop.js`
- Trigger: `Left Right Left Right Down Up Down Up`
- Behavior: toggles the hidden text-rendered lavalamp backdrop on and off
- Notes: temporary reveal path for the `LAVALAMP_TEXT_EASTER_EGG.md` experiment; default goo/fallback backdrop remains the public experience

## Ideas

### Terminal

- Behavior: press `/~ to open a command line, add some interesting commands. Should all mirror real commands that exist somewhere (not strictly any specific platform)
    - help command - lists *most* commands. Some intentionally left out.
    - grep my writeups
    - reading list
        - Co-Intelligence
        - The AI Con
        - House of Leaves
    - some completely useless joke API lookup - has no real use but the implication is I actually use it for something. should be totally random.
    - quit - close the tab (?)
    - ping -> pong (tickrate) (?)
    - ls a fake directory w interesting traces, fake leaked credentials, etc.
    - use fake leaked credentials to give user the ability to give themselves fake elevated permisions that unlock new stuff
        - destroy the site ? (reload restores)