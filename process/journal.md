# The journal of the frog

## What's next? (2025-09-02)

You know what? I should have been writing a journal or at least doing *something* to maintain a fix on what I'm trying to do with this thing. I'll check my commits to see if there's anything obvious...

I see some ideas!

- Bullet time/slow-motion... "tongue time"? Could be always on for the sheer glamour and awesomeness of never missing? Could be something you charge up and can use while pressing a special key? (That would be tricky for mobile.) Could be some kind of power-up that lasts for a while? Main thing would be just to implement it and think about the way it's acted out later on...
- Mutating frog... when I wrote the eyes function it became apparent I could add more eyes... maybe just randomly within the circle of the frog or som other constrained area? That implied maybe a mutant/radioactive fly that would trigger that? Would have a lot of implications though, like you'd have to have a way to track how many eyes the frog has and where they are so that you can draw it each frame? Sounds like work!
- Tongue targeting... earlier on I can see I had the idea that *where* you click is where the tongue eventually goes to, even if you move the frog around after launch... which is a totally different experience because you'd be predicting the fly's trajectory and then launching and hoping?
- Tongue adjust... kind of already have this because you can move the frog around while the tongue's going out.... what if control switched to the tongue instead? Can't just match mouseX though because I think that would be too easy? Would slide towards where the cursor/finger is? Hmmm, confusing?

Anyway, those are some things I could do. And there are probably millions more right?

## More ideas (2025-09-02)

Oh! Oh! Oh! Here's another couple of ideas

- Tongue lightning... well maybe that's the wrong description, but the idea that *if* you hit a fly there's a short moment (maybe connects back to bullet time) where you can then click somewhere else and the tongue continues in *that* direction, and if it gets another fly you can do it again and so on. Obviously requires multiple flies to be on the screen or there's no point, so that's a whole thing. Anyway that struck me as cool.
- Multiple flies... just because it's necessitated by the above, but it does open out more ideas probably... patterns (as in bullet hell), maybe interactions between the flies (or different types of flying creatures), the ability to catch more than one at the same time obviously, ... maybe just the sheer noise of lots of flies?
- Sound... yeah it could use some sound, sound is good
- Make it personal... Some kind of "personal" level to the flies (or the frog) I guess? I played [Time Flies](https://timeflies.buzz/) recently and it's genius at making the fly feel really real and important/poignant? Lots to learn from that game in general
- Multiple frogs... either as in multiplayer or just competing AI frogs would be pretty funny?

## Input and branching (2025-09-09)

Something I'm recognizing in the process right now, that requires thought and decision-making, is the question of input. When I made my first (pretty clumsy) switch to a mobile-friendly form of input it really opened a can of worms about how to control the thing. And that opens a can of worms in terms of how central and expressive the input approach ultimately will be, right?

Sitting in Myriade right now I wondered about a flick-oriented control where you can move the frog around by dragging it on the bottom, but then you can flick your finger up to shoot the tongue in that direction... much more frog-like at least in my mind... but probably a lot harder? Well you'd have to try.

And there are other ways too... like a non-moving frog for instance but you tap a target location and the tongue heads that way? That would be maybe a smaller step for the moment, though completely changes the tongue's movement... would need a speed and an *angle* instead of just it moving vertically every time.

But maybe that's what I try and then pending how that feels the flick could be a next step (though that sort of thing always seems fiddly)? Although maybe the flick takes it to a place that's not quite as friendly for desktop computers/mouse-input? And does it end up just not feeling quite so dynamic if the frog doesn't move around? HMMMM. Well maybe it's just a try it and see... maybe there's a way to preserve the different input style? Probably not though. A smart person would make a branch and try that, but that will make the branch invisible? Or... actually what if I made *this* a branch and didn't continue that branch (never merged it) as a way of sign-pointing a major build moment? Have we already discussed this within MDM?? It suddenly seems like quite a great idea? A branch not to explore something new but to preserve something old...! Huh.