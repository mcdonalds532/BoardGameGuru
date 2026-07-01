# Fine-tune Evaluation: Base vs LoRA-tuned Qwen2.5-3B-Instruct

## [Catan] Can I trade resources with the bank if I don't have a harbor?

**Base model:**
No, according to the rulebook excerpt provided, you can only trade with the bank at a 3:1 or 2:1 ratio if you have a settlement or city on a harbor. Without a harbor, you cannot trade with the bank.

**Fine-tuned model:**
No, you cannot trade with the bank without a harbor.

---

## [Catan] What happens to my cards if someone rolls a 7 and I have more than 7 resource cards?

**Base model:**
If someone rolls a "7" and you have more than 7 resource cards, you must discard half of them. If you have an odd number of cards after discarding, you round down to the nearest whole number before discarding.

**Fine-tuned model:**
You must discard half of your resource cards. If you have an odd number, round down.

---

## [Carcassonne] How many points is a completed cloister worth?

**Base model:**
A completed cloister is worth 9 points. This information is directly stated in the rulebook excerpt provided.

**Fine-tuned model:**
9 points

---

## [Carcassonne] Can two players tie for control of a city?

**Base model:**
Yes, according to the rules excerpt provided, if two or more players tie with the most thieves or knights in a completed road or city, they each earn the total points for that road or city. This indicates that it is possible for two or more players to tie for control of a city.

**Fine-tuned model:**
Yes, two or more players can tie for control of a city.

---

## [Codenames] What happens if my team touches the assassin card?

**Base model:**
If the field operative touches the assassin card, the word is covered by the assassin card. This ends the game! The team that contacted the assassin loses.

**Fine-tuned model:**
The game ends and the team that contacted the assassin loses.

---

## [Codenames] Can I give a one-word clue that relates to two words at once?

**Base model:**
No, according to the provided rulebook excerpts, you cannot give a one-word clue that relates to two words at once. The rule specifically states that "Your operatives will have to figure that out for themselves" when dealing with multiple unguessed words related to previous clues.

**Fine-tuned model:**
No, you cannot give a one-word clue that relates to two words at once.

---

## [Pandemic] How many disease cubes can be on a single city at once?

**Base model:**
Based on the provided rulebook excerpt, there is no specific limit given for the number of disease cubes that can be present on a single city at once. The excerpt discusses removing cubes when a disease is cured but does not specify how many cubes can exist on a city before this happens. Therefore, we cannot determine the exact number of disease cubes per city from the information provided.

**Fine-tuned model:**
The maximum number of disease cubes per city is three.

---

## [Pandemic] What triggers a chain reaction outbreak?

**Base model:**
The text does not explicitly state what triggers a chain reaction outbreak. It only mentions that one occurs "first" when moving the outbreaks marker forward, but does not specify conditions for this to happen.

**Fine-tuned model:**
The outbreaks marker moving 1 space on the Outbreaks Track.

---

## [Ticket To Ride] How many points do I lose if I fail to complete a Destination Ticket?

**Base model:**
Based on the provided rule excerpt, there is no specific mention of how many points are lost if you do not successfully complete the route given on the Destination Ticket(s) you kept. The relevant information pertains to the order of play and actions during a player's turn, but does not address point deductions for failing to complete a Destination Ticket.

**Fine-tuned model:**
Points are lost if you do not successfully complete the route given on the Destination Ticket(s) you kept. No specific point loss amount is stated in the excerpt.

---

## [Ticket To Ride] What happens when a player has only 2 trains left at the end of their turn?

**Base model:**
According to the provided rulebook excerpt, when a player's stock of colored plastic trains gets down to only 0, 1, or 2 trains left at the end of their turn, each player, including that player, gets one final turn. The game then ends and players calculate their final scores.

**Fine-tuned model:**
The game ends and players calculate their final scores.

---

## [Catan] What does the Monopoly development card do?

**Base model:**
The Monopoly development card allows the player who plays it to name one type of resource. Other players must then give all of their resource cards of that type to the player who played the card. If there aren't enough resource cards in the supply to satisfy everyone's demand for that resource, no player receives any of that resource that turn.

**Fine-tuned model:**
It forces the other players to give you all of the resource cards of the type you name.

---

## [Catan] How do I get the Largest Army card?

**Base model:**
To acquire the Largest Army card, you need to have 3 knight cards in front of yourself. When a player with more knight cards than the current holder of the Largest Army card takes the card, they immediately receive the Largest Army card and gain 2 victory points.

**Fine-tuned model:**
The largest army card is acquired by having the most knight cards in front of yourself.

---

## [Carcassonne] Can a follower be placed on a river tile?

**Base model:**
Based on the provided rulebook excerpts, there is no mention of river tiles or how followers can be placed on them. Therefore, I cannot determine if a follower can be placed on a river tile from the given information.

**Fine-tuned model:**
No, a follower cannot be placed on a river tile. A river tile is not a field, city, or road segment.

---

## [Carcassonne] How do farms get scored during the game, before the game ends?

**Base model:**
Based on the provided rulebook excerpt, farms are not scored during the game itself; they are scored at the end of the game when all features are completed. The scoring rules for farms are detailed on page 4 under FARMER SCORING, but the actual scoring takes place after the game concludes. During the game, players place farmers on the farms as they become available, but the points for these farms are determined based on which player has the most farmers in each farm that supplies completed cities at the end of the game.

**Fine-tuned model:**
Farms are scored at the end of the game. Farms are scored based on the number of completed cities they supply. Farms are separated from each other by roads, cities, and the edge of the map. Farms are scored by the player who controls them.

---

## [Codenames] Can I use a proper name like a person's name as a clue?

**Base model:**
Yes, according to the rulebook, proper names are always valid clues if they follow the other rules. However, you might want to specify whether you mean a specific individual (e.g., George Washington) or a title (e.g., The Three Musketeers).

**Fine-tuned model:**
Yes, proper names are always valid clues if they follow the other rules.

---

## [Codenames] What happens if a spymaster gives an invalid clue?

**Base model:**
If a spymaster gives an invalid clue, the team's turn ends immediately. Additionally, the other team's spymaster may cover one of his or her words with an agent card before giving the next clue.

**Fine-tuned model:**
The team's turn ends immediately. The other team's spymaster may cover one of his or her words with an agent card before giving the next clue.

---

## [Pandemic] What does the Medic do differently when treating a disease compared to other roles?

**Base model:**
When treating a disease, the Medic removes all cubes, not just one, of the same color from the board. This action is specified in the rule excerpt for the MEDIC role in Pandemic. No other differences are mentioned in the provided excerpts regarding how the Medic treats diseases compared to other roles.

**Fine-tuned model:**
The Medic removes all cubes, not just one, of the same color when doing the Treat Disease action.

---

## [Pandemic] How many City cards do I need to discard to cure a disease?

**Base model:**
According to the rule excerpt provided, to cure a disease, you need to discard 5 City cards of the same color from your hand.

**Fine-tuned model:**
5 City cards of the same color

---

## [Ticket To Ride] How many points do I score for claiming a route of length 1?

**Base model:**
The information provided does not specify the point value for claiming a route of any particular length. It only describes how to claim routes and what happens when a route is claimed, but it does not mention scoring or point values associated with different route lengths.

**Fine-tuned model:**
The excerpt does not provide information about scoring for claiming a route of length 1.

---

## [Ticket To Ride] Can I use any type of Train Car card to claim a Grey route?

**Base model:**
No, according to the rulebook excerpt, for routes that are Gray colored, a player must use a set of cards of any one color, not specifically any type of Train Car card. The key point is that it requires a set of cards of any one color, not necessarily Train Car cards.

**Fine-tuned model:**
Yes, a player may use any type of Train Car card to claim a Grey route.

---

