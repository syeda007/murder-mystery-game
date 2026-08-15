import { MysteryCase } from '../types';

export const DEFAULT_CASES: MysteryCase[] = [
  {
    id: 'midnight-express',
    title: 'The Midnight Express Poisoning',
    subtitle: 'A locked-compartment cyanide killing in the snowbound Swiss Alps',
    era: '1928, Interwar Golden Age',
    setting: 'The Trans-Alpine Continental Express, stalled in an avalanche near St. Moritz',
    difficulty: 'Detective',
    estimatedTime: '20-30 min',
    summary: 'At 01:15 AM, during an emergency stop in the blizzard, wealthy art collector Julian Vance was found collapsed over his walnut chess table inside First-Class Compartment 4B. The smell of bitter almonds hung in the air. The train remains trapped until morning. You have until dawn to discover who laced his midnight cognac.',
    victim: {
      name: 'Julian Vance',
      title: 'Wealthy Antiquities Dealer & Collector',
      age: 58,
      backstory: 'Julian was renowned for ruthless acquisition of heirloom jewelry and private art estates across Europe. He was carrying a disputed Renaissance emerald necklace worth a fortune.',
      causeOfDeath: 'Potassium Cyanide poisoning ingested via vintage Courvoisier cognac',
      timeOfDeath: 'Estimated between 00:45 AM and 01:05 AM',
      locationFound: 'First-Class Sleeper Compartment 4B',
      autopsyNotes: 'Rapid respiratory arrest. Distinct smell of bitter almonds on breath. No struggle or defensive wounds. Glass residue contains crystallized cyanide salts.'
    },
    rooms: [
      {
        id: 'compartment-4b',
        name: "Julian's Compartment 4B",
        description: 'The scene of the crime. Velvet curtains, mahogany paneling, and an unfinished game of chess on the table.',
        atmosphere: 'The smell of bitter almond and stale tobacco lingers. The window is latched tight against the howling alpine blizzard.',
        searched: false,
        itemsToSearch: [
          {
            id: 'search-chess-table',
            name: 'Chess Table & Crystal Snifter',
            description: 'Inspect the half-empty cognac glass and the chessboard arrangement.',
            clueId: 'clue-cognac-glass',
            searched: false
          },
          {
            id: 'search-briefcase',
            name: 'Leather Briefcase Under Berth',
            description: 'Examine the unlocked monogrammed leather case.',
            clueId: 'clue-forged-will',
            searched: false
          },
          {
            id: 'search-overcoat',
            name: "Julian's Fur Overcoat",
            description: 'Check the pockets of the heavy wool coat hanging on the brass peg.',
            clueId: 'clue-blackmail-telegram',
            searched: false
          }
        ]
      },
      {
        id: 'dining-car',
        name: 'First-Class Dining Car & Bar',
        description: 'The elegant art-deco dining salon where passengers gathered before midnight.',
        atmosphere: 'Crystal chandeliers clink softly with the train vibrations. White tablecloths and polished silver.',
        searched: false,
        itemsToSearch: [
          {
            id: 'search-bar-counter',
            name: 'Bartender Service Station',
            description: 'Search the liquor cabinet and service logs.',
            clueId: 'clue-bar-receipt',
            searched: false
          },
          {
            id: 'search-lounge-sofa',
            name: 'Velour Corner Booth',
            description: 'Inspect where Countess Helena was seated reading until midnight.',
            clueId: 'clue-lace-handkerchief',
            searched: false
          }
        ]
      },
      {
        id: 'luggage-car',
        name: 'Baggage & Freight Car',
        description: 'A chilly, unheated car stacked with steamer trunks, post bags, and medical crates.',
        atmosphere: 'Drafty and pitch dark except for a single swinging tungsten bulb.',
        searched: false,
        itemsToSearch: [
          {
            id: 'search-medical-trunk',
            name: 'Dr. Sterling’s Travelling Medical Chest',
            description: 'Inspect the brass-bound leather apothecary box.',
            clueId: 'clue-apothecary-phial',
            searched: false
          },
          {
            id: 'search-post-sacks',
            name: 'Diplomatic Mail Pouch',
            description: 'Check the sealed consular mail dispatch.',
            clueId: 'clue-confiscation-order',
            searched: false
          }
        ]
      },
      {
        id: 'conductor-cubicle',
        name: 'Train Conductor Station',
        description: 'The narrow vestibule cabin containing train schedules, master keys, and passenger manifest.',
        atmosphere: 'Smells of coal smoke and damp wool. Official timetables pinned to the bulkhead.',
        searched: false,
        itemsToSearch: [
          {
            id: 'search-master-key-hook',
            name: 'Carriage Key Rack & Pass-Keys',
            description: 'Check if any compartment skeleton keys are unaccounted for.',
            clueId: 'clue-skeleton-key',
            searched: false
          },
          {
            id: 'search-conductor-log',
            name: 'Night Watch Logbook',
            description: 'Read the timestamps recorded when the avalanche hit at 00:30 AM.',
            clueId: 'clue-conductor-log',
            searched: false
          }
        ]
      }
    ],
    suspects: [
      {
        id: 'dr-arthur-sterling',
        name: 'Dr. Arthur Sterling',
        role: 'Personal Physician',
        age: 52,
        avatarSeed: 'sterling',
        personality: 'Quiet, fastidious, defensive under pressure. Speaks with clinical precision.',
        occupation: 'Physician & Toxicology Lecturer',
        relationToVictim: 'Traveling companion and medical advisor to Julian Vance for five years.',
        publicAlibi: 'Claims he was in the Baggage Car retrieving his heart medication from his trunk between 00:40 and 01:00 AM, then went straight to bed.',
        secret: 'Julian discovered Sterling had been prescribing lethal doses of morphine to elderly heiresses in London and was blackmailing him for £10,000.',
        secretUnlocked: false,
        motive: 'To silence Julian before the blackmailer reported him to the British Medical Council.',
        stressLevel: 25,
        suspiciousnessRating: 4,
        isCulprit: true,
        dialogueHistory: [
          {
            id: 'init-sterling',
            sender: 'suspect',
            text: 'Inspector, this is an appalling tragedy. Julian was my patient and friend. I warned him about his strained heart, but cyanide... my God. Ask whatever you need, though I was simply retrieving my angina drops in the baggage hold.',
            timestamp: '01:30 AM'
          }
        ],
        keyQuotes: [
          'Cyanide is an undignified weapon. Only a chemist or a madman would handle it on a moving train.',
          'Julian was ruthless in business, yes, but who among his enemies would dare do this in mid-transit?'
        ]
      },
      {
        id: 'countess-helena-vane',
        name: 'Countess Helena Vane',
        role: 'Exiled Aristocrat',
        age: 44,
        avatarSeed: 'helena',
        personality: 'Haughty, sharp-tongued, smoking Turkish cigarettes from an ivory holder.',
        occupation: 'Collector & Socialite',
        relationToVictim: 'Former business partner; Julian bought her family’s Venetian emerald necklace during her family’s bankruptcy at a fraction of its worth.',
        publicAlibi: 'Claims she was sipping champagne in the dining car with the conductor until 00:45 AM, then retired to Compartment 2A.',
        secret: 'She had slipped into Julian’s room at 00:20 AM to steal back the emerald necklace, but found the safe empty—Julian had already pawned it in Vienna.',
        secretUnlocked: false,
        motive: 'Revenge for the loss of her ancestral estate and heirloom jewelry.',
        stressLevel: 35,
        suspiciousnessRating: 4,
        isCulprit: false,
        dialogueHistory: [
          {
            id: 'init-helena',
            sender: 'suspect',
            text: 'Do not cast your vulgar insinuations at me, detective. Julian Vance was a parasite who preyed upon impoverished nobility. But I am a Vane—if I wished him dead, I would have challenged him openly, not slipped poison into his cheap liquor.',
            timestamp: '01:32 AM'
          }
        ],
        keyQuotes: [
          'The man stole my family’s heritage with a smile. Death was too quick for him.',
          'I left the dining salon precisely when the lights flickered during the snowdrift stop.'
        ]
      },
      {
        id: 'marcus-kane',
        name: 'Marcus Kane',
        role: 'Disgraced Art Appraiser',
        age: 38,
        avatarSeed: 'marcus',
        personality: 'Nervous, biting fingernails, constantly checking his gold pocket watch.',
        occupation: 'Independent Antiquities Valuer',
        relationToVictim: 'Julian publicly exposed Kane for authenticating a forged Dutch Master painting three years ago, ruining his career.',
        publicAlibi: 'Claims he was asleep in Sleeper 6C since 11:30 PM due to a migraine.',
        secret: 'He was awake, trying to confront Julian about a forged signature on a sale contract, but heard someone arguing inside 4B at 00:50 AM and fled in fear.',
        secretUnlocked: false,
        motive: 'Professional ruin and financial bankruptcy caused by Julian’s public accusations.',
        stressLevel: 60,
        suspiciousnessRating: 3,
        isCulprit: false,
        dialogueHistory: [
          {
            id: 'init-kane',
            sender: 'suspect',
            text: 'I was asleep! I took two chloral hydrate tablets at 11:30. I didn’t leave my berth! You can’t pin this on me just because Vance ruined my reputation!',
            timestamp: '01:35 AM'
          }
        ],
        keyQuotes: [
          'I heard heavy footsteps outside my door right around 00:50, smelling of sweet almond and medicinal alcohol!',
          'Vance had a dozen enemies on this train alone.'
        ]
      },
      {
        id: 'clara-duval',
        name: 'Clara Duval',
        role: 'Julian’s Private Secretary',
        age: 27,
        avatarSeed: 'clara',
        personality: 'Composed, intelligent, observant, taking shorthand notes in her leather pad.',
        occupation: 'Personal Secretary & Typist',
        relationToVictim: 'Managed Julian’s correspondence, financial ledgers, and travel arrangements.',
        publicAlibi: 'Was in Compartment 4A typing Julian’s morning telegrams until 01:00 AM.',
        secret: 'She is the estranged niece of a collector whom Julian defrauded; she took the job under a false name to gather evidence for the French police.',
        secretUnlocked: false,
        motive: 'Justice for her father who took his own life after Julian swindled his gallery.',
        stressLevel: 20,
        suspiciousnessRating: 2,
        isCulprit: false,
        dialogueHistory: [
          {
            id: 'init-clara',
            sender: 'suspect',
            text: 'I delivered Mr. Vance’s correspondence folder at 00:35 AM. He was alive, playing chess alone, and poured himself a fresh glass of Courvoisier from a sealed bottle Dr. Sterling had brought him from the luggage car.',
            timestamp: '01:38 AM'
          }
        ],
        keyQuotes: [
          'Dr. Sterling brought that specific vintage bottle to Mr. Vance’s room personally at 00:40 AM.',
          'Mr. Vance had just told Dr. Sterling that his "grace period" had expired.'
        ]
      }
    ],
    clues: [
      {
        id: 'clue-cognac-glass',
        name: 'Residue-Coated Crystal Snifter',
        category: 'toxicology',
        importance: 'key',
        locationId: 'compartment-4b',
        locationName: "Julian's Compartment 4B",
        description: 'A heavy Baccarat crystal glass containing dried amber liquid and white crystalline powder at the bottom rim.',
        details: 'Lab smell tests confirm Potassium Cyanide. The bottle of Courvoisier on the tray was unpoisoned—the cyanide was rubbed directly into the sugar-frosted interior rim of the glass before pouring.',
        discovered: false,
        relatedSuspectId: 'dr-arthur-sterling',
        contradictionHint: 'Only someone with medical/chemical access who prepared the drink glass beforehand could ensure the poison hit the first sip without contaminating the main bottle.'
      },
      {
        id: 'clue-forged-will',
        name: 'Disputed Estate Ledger & Telegram Draft',
        category: 'document',
        importance: 'supporting',
        locationId: 'compartment-4b',
        locationName: "Julian's Compartment 4B",
        description: 'A folder of bank transfers revealing payments of £2,000 marked "Quietude / Dr. A.S."',
        details: 'A draft telegram addressed to Scotland Yard Special Branch: "HAVE PROOF OF STERLING’S LETHAL PRESCRIPTIONS. WILL DELIVER AT ZURICH TERMINUS."',
        discovered: false,
        relatedSuspectId: 'dr-arthur-sterling',
        contradictionHint: 'Proves Dr. Sterling had an immediate, existential motive to prevent Julian from reaching Zurich.'
      },
      {
        id: 'clue-blackmail-telegram',
        name: 'Pawn Ticket from Vienna',
        category: 'document',
        importance: 'red_herring',
        locationId: 'compartment-4b',
        locationName: "Julian's Compartment 4B",
        description: 'Receipt proving the Venetian Emerald necklace had already been liquidated three weeks prior.',
        details: 'Clears the theory that Julian was killed tonight to loot the emeralds from his safe.',
        discovered: false,
        relatedSuspectId: 'countess-helena-vane'
      },
      {
        id: 'clue-apothecary-phial',
        name: 'Emptied Glass Phial Marked "Kali Cyanid."',
        category: 'physical',
        importance: 'key',
        locationId: 'luggage-car',
        locationName: 'Baggage & Freight Car',
        description: 'A small amber glass bottle hidden behind a stack of surgical splints inside Dr. Sterling’s locked apothecary trunk.',
        details: 'The seal is broken. Chemical traces match the exact formulation found in the snifter. Dr. Sterling claimed his trunk only contained angina amyl nitrate capsules.',
        discovered: false,
        relatedSuspectId: 'dr-arthur-sterling',
        contradictionHint: 'Directly contradicts Dr. Sterling’s claim that he only possessed cardiovascular drops in the baggage car.'
      },
      {
        id: 'clue-lace-handkerchief',
        name: 'Monogrammed Silk Handkerchief "H.V."',
        category: 'physical',
        importance: 'red_herring',
        locationId: 'dining-car',
        locationName: 'First-Class Dining Car & Bar',
        description: 'A fine Belgian lace handkerchief dropped between the leather booth cushions.',
        details: 'Smells of violet perfume. Confirms Countess Helena was in the dining car until midnight, not lurking in the corridors.',
        discovered: false,
        relatedSuspectId: 'countess-helena-vane'
      },
      {
        id: 'clue-conductor-log',
        name: 'Carriage Passage Log & Snow Incident Record',
        category: 'document',
        importance: 'key',
        locationId: 'conductor-cubicle',
        locationName: 'Train Conductor Station',
        description: 'Official log recorded by Conductor Blanc during the avalanche stop.',
        details: 'Records show: 00:30 AM train stopped. 00:40 AM Dr. Sterling observed carrying a leather case into Compartment 4B with a fresh snifter. 00:52 AM Dr. Sterling seen hurriedly returning toward his berth.',
        discovered: false,
        relatedSuspectId: 'dr-arthur-sterling',
        contradictionHint: 'Completely dismantles Dr. Sterling’s alibi of being asleep in his berth between 00:40 and 01:00 AM.'
      },
      {
        id: 'clue-bar-receipt',
        name: 'Bar Order Chits',
        category: 'document',
        importance: 'supporting',
        locationId: 'dining-car',
        locationName: 'First-Class Dining Car & Bar',
        description: 'Receipts for two glasses of Courvoisier requested at 00:32 AM.',
        details: 'Order signed by Dr. Arthur Sterling, requesting two clean snifters sent to the luggage vestibule.',
        discovered: false,
        relatedSuspectId: 'dr-arthur-sterling'
      },
      {
        id: 'clue-skeleton-key',
        name: 'Brass Carriage Pass-Key',
        category: 'physical',
        importance: 'supporting',
        locationId: 'conductor-cubicle',
        locationName: 'Train Conductor Station',
        description: 'Master skeleton key for 1st-Class compartments.',
        details: 'All keys accounted for on the board, indicating the killer did not break in—Julian let them in willingly or was handed the drink by an acquaintance.',
        discovered: false
      }
    ],
    timeline: [
      {
        id: 'time-1',
        time: '11:15 PM',
        description: 'Julian Vance dines alone in Dining Car, argues briefly with Countess Helena about family heirlooms.',
        location: 'Dining Car',
        suspectId: 'countess-helena-vane',
        suspectName: 'Countess Helena Vane',
        verified: true
      },
      {
        id: 'time-2',
        time: '11:30 PM',
        description: 'Marcus Kane retreats to his berth claiming a severe migraine; takes sleeping pills.',
        location: 'Sleeper 6C',
        suspectId: 'marcus-kane',
        suspectName: 'Marcus Kane',
        verified: true
      },
      {
        id: 'time-3',
        time: '00:30 AM',
        description: 'Avalanche strikes the front engine; train halts abruptly in the mountain pass. Lights flicker.',
        location: 'Mountain Pass',
        verified: true
      },
      {
        id: 'time-4',
        time: '00:35 AM',
        description: 'Clara Duval delivers correspondence folders to Julian in Compartment 4B. Julian is alive and well.',
        location: 'Compartment 4B',
        suspectId: 'clara-duval',
        suspectName: 'Clara Duval',
        verified: true
      },
      {
        id: 'time-5',
        time: '00:40 AM',
        description: 'Dr. Sterling visits the Baggage Car, retrieves potassium cyanide phial, orders 2 clean snifters from bar.',
        location: 'Baggage Car & Bar',
        suspectId: 'dr-arthur-sterling',
        suspectName: 'Dr. Arthur Sterling',
        isContradiction: true,
        verified: false
      },
      {
        id: 'time-6',
        time: '00:45 AM',
        description: 'Dr. Sterling enters Compartment 4B, offers Julian a "peace offering" toast of vintage Courvoisier in the poisoned crystal glass.',
        location: 'Compartment 4B',
        suspectId: 'dr-arthur-sterling',
        suspectName: 'Dr. Arthur Sterling',
        isContradiction: true,
        verified: false
      },
      {
        id: 'time-7',
        time: '01:15 AM',
        description: 'Conductor Blanc makes rounds, finds Compartment 4B door ajar and Julian collapsed over the chessboard.',
        location: 'Compartment 4B',
        verified: true
      }
    ],
    solution: {
      culpritId: 'dr-arthur-sterling',
      culpritName: 'Dr. Arthur Sterling',
      murderWeapon: 'Potassium Cyanide laced on the crystal snifter rim',
      trueMotive: 'Julian Vance had gathered irrefutable evidence of Dr. Sterling murdering wealthy patients in London with morphine overdoses, and was about to hand the dossier to Scotland Yard at the Zurich terminal.',
      howAlibiWasBroken: 'The Conductor’s logbook and Bar Order Chits proved Sterling did not go straight to sleep, but ordered two snifters and was seen entering Compartment 4B at 00:40 AM. The matching Potassium Cyanide phial was discovered in his personal medical trunk.',
      fullEpilogue: 'Cornered by your relentless presentation of the Conductor’s log, the bar receipt, and the chemical phial extracted from his medical trunk, Dr. Sterling’s aristocratic poise crumbles. He slumps into the leather chair, confessing: "Julian was a bloodsucker! He had proof of my London missteps and was going to destroy me in Zurich! I had no choice!" Conductor Blanc places Dr. Sterling in handcuffs in the luggage car until Swiss police arrive at sunrise. You have solved the Midnight Express Murder!'
    },
    partyRounds: [
      {
        roundNumber: 1,
        title: 'The Avalanche & The Body Found',
        gmNarration: 'The heavy express train has come to a screeching halt amidst howling blizzards. Conductor Blanc’s whistle pierces the frozen air. Julian Vance lies lifeless in Compartment 4B, smelling of bitter almonds. Every passenger must now account for where they were when the avalanche struck at 00:30 AM!',
        objectives: [
          'Introduce all suspect characters and read your public alibis aloud.',
          'Inspect the Crime Scene (Compartment 4B) and discover initial clues.',
          'Each player asks one question to a fellow suspect.'
        ],
        publicClueReveal: 'The Conductor reveals that the train is isolated until morning. The victim died within the last 45 minutes.',
        suspectActions: [
          {
            suspectId: 'dr-arthur-sterling',
            privatePrompt: 'Act deeply saddened by Julian’s death. Emphasize that his heart was always weak. Avoid mentioning your trip to the luggage car unless directly confronted.'
          },
          {
            suspectId: 'countess-helena-vane',
            privatePrompt: 'Be haughty and dismissive of the victim. If asked about the emeralds, admit Julian cheated your family, but scoff at poisoning as "a peasant\'s weapon."'
          },
          {
            suspectId: 'marcus-kane',
            privatePrompt: 'Act jittery and irritable. You genuinely were asleep until a loud noise in the corridor startled you at 00:50 AM.'
          },
          {
            suspectId: 'clara-duval',
            privatePrompt: 'State clearly that you delivered the papers at 00:35 AM and Julian was healthy. Mention you saw Dr. Sterling walking with glassware.'
          }
        ]
      },
      {
        roundNumber: 2,
        title: 'The Secrets Emerge',
        gmNarration: 'Tensions flare in the dining salon as physical evidence from the baggage car and conductor logs are laid out. The mask of polite society begins to slip.',
        objectives: [
          'Confront suspects with physical evidence found in the baggage car and conductor station.',
          'Suspects must reveal one of their hidden secrets when pressed with specific clues.',
          'Establish the exact timeline between 00:35 AM and 01:00 AM.'
        ],
        publicClueReveal: 'The toxicology report confirms Potassium Cyanide was applied directly to the glass rim, not the bottle.',
        suspectActions: [
          {
            suspectId: 'dr-arthur-sterling',
            privatePrompt: 'If someone brings up the phial or the bar chits, become defensive. Claim the cyanide was an old specimen for zoological preservation.'
          },
          {
            suspectId: 'countess-helena-vane',
            privatePrompt: 'Admit you peeked into Julian\'s room earlier to look for your necklace, but found nothing and left immediately.'
          },
          {
            suspectId: 'marcus-kane',
            privatePrompt: 'Reveal that you saw someone in a dark physician’s overcoat hurrying from Compartment 4B smelling of almonds.'
          },
          {
            suspectId: 'clara-duval',
            privatePrompt: 'Share that Julian had a secret envelope addressed to Scotland Yard that has vanished from his desk.'
          }
        ]
      },
      {
        roundNumber: 3,
        title: 'The Grand Accusation & Vote',
        gmNarration: 'The clock strikes 05:00 AM. Dawn light begins to crest over the snowy peaks. The Game Master calls for final accusations. Who killed Julian Vance, with what weapon, and what was their true motive?',
        objectives: [
          'Each player or team delivers their 60-second Indictment Speech.',
          'Cast votes for the primary suspect, murder weapon, and motive.',
          'The Game Master unseals the official verdict and epilogue.'
        ],
        suspectActions: []
      }
    ]
  },
  {
    id: 'blackwood-manor',
    title: 'The Blackwood Manor Will Reading',
    subtitle: 'A locked-observatory murder during an isolated coastal tempest',
    era: '1933, Gothic Mystery',
    setting: 'Blackwood Cliff Estate, Cornwall Coast, England',
    difficulty: 'Mastermind',
    estimatedTime: '25-35 min',
    summary: 'Lord Alistair Blackwood summoned his estranged heirs to announce drastic revisions to his £500,000 estate. At 10:45 PM, a thunderous crash echoed from the top of the locked Victorian observatory tower. Lord Alistair was discovered slumped over his star-chart desk, pierced with an ornate obsidian dagger, while the only heavy iron door was bolted from the inside.',
    victim: {
      name: 'Lord Alistair Blackwood',
      title: '9th Earl of Blackwood & Renowned Astronomer',
      age: 67,
      backstory: 'An eccentric, wealthy polymath obsessed with astronomy and ancient occult relics. He recently disowned his family to endow a foundation.',
      causeOfDeath: 'Stab wound to the thoracic cavity via an ancient ceremonial dagger, accompanied by paralyzed neuromuscular reflex',
      timeOfDeath: '10:30 PM - 10:45 PM',
      locationFound: 'The Top Observatory Tower (Bolted from the inside)',
      autopsyNotes: 'A single fatal puncture wound. Peculiar white residue on the victim’s right cuff. The observatory window was unlatched 4 inches.'
    },
    rooms: [
      {
        id: 'observatory',
        name: 'The Stargazer Observatory Tower',
        description: 'A circular stone chamber at the pinnacle of the manor with a massive brass telescope pointing through the domed roof.',
        atmosphere: 'Rain hammers the copper dome. The heavy oak door’s sliding brass bolt was locked from inside.',
        searched: false,
        itemsToSearch: [
          {
            id: 'search-telescope-desk',
            name: 'Star Chart Desk & Obsidian Dagger',
            description: 'Inspect the bloody desk and the ancient ceremonial dagger.',
            clueId: 'clue-obsidian-dagger',
            searched: false
          },
          {
            id: 'search-pulley-window',
            name: 'Dome Shutter Pulley & Window Latch',
            description: 'Examine the mechanical cables and exterior stone ledge.',
            clueId: 'clue-fishing-line-rig',
            searched: false
          }
        ]
      },
      {
        id: 'library-study',
        name: 'Lord Alistair’s Private Library',
        description: 'Two-story library filled with first editions, astronomical globes, and the estate safe.',
        atmosphere: 'The fireplace crackles softly. The smell of old parchment and pipe cedar.',
        searched: false,
        itemsToSearch: [
          {
            id: 'search-wall-safe',
            name: 'Cast Iron Wall Safe',
            description: 'Check the heavy safe hidden behind the portrait of Lady Eleanor.',
            clueId: 'clue-draft-will',
            searched: false
          },
          {
            id: 'search-desk-blotter',
            name: 'Leather Desk Blotter & Wastebasket',
            description: 'Inspect torn letters and fountain pen impressions.',
            clueId: 'clue-disinheritance-letter',
            searched: false
          }
        ]
      },
      {
        id: 'conservatory',
        name: 'Victorian Glass Conservatory',
        description: 'Exotic tropical ferns, night-blooming orchids, and gardening tools.',
        atmosphere: 'Humid, earthy, with lightning illuminating the fogged glass panels.',
        searched: false,
        itemsToSearch: [
          {
            id: 'search-botanical-bench',
            name: 'Orchid Worktable & Chemical Sprays',
            description: 'Inspect botanical extracts and curare dart equipment.',
            clueId: 'clue-botanical-extract',
            searched: false
          }
        ]
      }
    ],
    suspects: [
      {
        id: 'eleanor-blackwood',
        name: 'Lady Eleanor Blackwood',
        role: 'Estranged Second Wife',
        age: 41,
        avatarSeed: 'eleanor',
        personality: 'Charming, calculating, intensely composed beneath a veneer of grief.',
        occupation: 'Socialite & Estate Manager',
        relationToVictim: 'Married Alistair 8 years ago; he planned to divorce her and leave her only a nominal £100 annuity.',
        publicAlibi: 'Claims she was in the drawing room playing Chopin on the grand piano from 10:15 PM until the crash.',
        secret: 'She had hired an engineering clockmaker to build a rigged cable release mechanism that could trip the observatory bolt from the exterior roof gutter.',
        secretUnlocked: false,
        motive: 'To inherit the full £500,000 estate before Alistair signed the revised disinheritance will at midnight.',
        stressLevel: 30,
        suspiciousnessRating: 5,
        isCulprit: true,
        dialogueHistory: [
          {
            id: 'init-eleanor',
            sender: 'suspect',
            text: 'Alistair was brilliant, but paranoid in his final months. He locked himself in that tower night after night. How anyone could pierce his heart inside a room bolted from within is beyond earthly explanation.',
            timestamp: '11:00 PM'
          }
        ],
        keyQuotes: [
          'I was playing the Nocturne in E-flat in the drawing room. The servants heard the piano without pause.',
          'Alistair’s will was to be finalized tomorrow morning. Why would I hasten his demise?'
        ]
      },
      {
        id: 'charles-blackwood',
        name: 'Charles Blackwood',
        role: 'Disowned Gambler Nephew',
        age: 31,
        avatarSeed: 'charles',
        personality: 'Boastful, heavily in debt, smelling of scotch.',
        occupation: 'Racehorse Owner & Speculator',
        relationToVictim: 'Only living male heir; owed £40,000 to London loan sharks.',
        publicAlibi: 'Claims he was in the billiard room smoking cigars with the butler.',
        secret: 'He broke into the library safe at 10:20 PM looking for bearer bonds, but found the safe already ransacked.',
        secretUnlocked: false,
        motive: 'Desperate need for money to avoid debtors\' prison.',
        stressLevel: 55,
        suspiciousnessRating: 3,
        isCulprit: false,
        dialogueHistory: [
          {
            id: 'init-charles',
            sender: 'suspect',
            text: 'Uncle Alistair was a lunatic! But I didn’t kill him! If he died before signing the new trust, I get the title, yes, but I couldn’t even climb the stairs with my injured knee!',
            timestamp: '11:05 PM'
          }
        ],
        keyQuotes: [
          'Eleanor was always whispering to the solicitors in the hallway.',
          'The butler knows I never left the billiard table.'
        ]
      },
      {
        id: 'dr-gideon-cross',
        name: 'Dr. Gideon Cross',
        role: 'Botanist & Longtime Colleague',
        age: 59,
        avatarSeed: 'gideon',
        personality: 'Eccentric, bespectacled, hands stained with plant tannins.',
        occupation: 'Royal Horticultural Fellow',
        relationToVictim: 'Co-authored papers on ancient Mesoamerican poisons and star rituals.',
        publicAlibi: 'Was in the conservatory cataloging rare night orchids.',
        secret: 'He supplied Alistair with an organic paralytic compound intended for Alistair\'s insomnia experiments.',
        secretUnlocked: false,
        motive: 'Alistair threatened to publish proof that Gideon plagiarized his Amazonian botanical discoveries.',
        stressLevel: 40,
        suspiciousnessRating: 3,
        isCulprit: false,
        dialogueHistory: [
          {
            id: 'init-gideon',
            sender: 'suspect',
            text: 'I was tending to the Queen of the Night orchid. It blooms only once every five years! I had no quarrel with Alistair that could not be settled in the journals.',
            timestamp: '11:10 PM'
          }
        ],
        keyQuotes: [
          'The obsidian dagger was an artifact we brought back from Oaxaca in 1912.',
          'Whoever used it knew the anatomical strike point to prevent an outcry.'
        ]
      }
    ],
    clues: [
      {
        id: 'clue-obsidian-dagger',
        name: 'Mesoamerican Obsidian Ritual Blade',
        category: 'physical',
        importance: 'supporting',
        locationId: 'observatory',
        locationName: 'The Stargazer Observatory Tower',
        description: 'A razor-sharp obsidian dagger with carved jaguar glyphs on the jade hilt.',
        details: 'Traces of plant wax and oil on the handle. Wiped clean of fingerprints.',
        discovered: false,
        relatedSuspectId: 'eleanor-blackwood'
      },
      {
        id: 'clue-fishing-line-rig',
        name: 'Spool of Braided Steel Wire & Gutter Pulley',
        category: 'physical',
        importance: 'key',
        locationId: 'observatory',
        locationName: 'The Stargazer Observatory Tower',
        description: 'Fine steel wire looped through the exterior shutter hinge, with a custom weighted brass pin that slides the interior bolt shut when pulled from the roof balustrade.',
        details: 'This ingenious locked-room trick allowed the killer to stab Lord Alistair, step out onto the terrace, and yank the wire to throw the interior iron bolt shut from the outside!',
        discovered: false,
        relatedSuspectId: 'eleanor-blackwood',
        contradictionHint: 'Proves the locked room was an artificial illusion created from the terrace above.'
      },
      {
        id: 'clue-draft-will',
        name: 'Unsigned Will Disinheriting Eleanor',
        category: 'document',
        importance: 'key',
        locationId: 'library-study',
        locationName: 'Lord Alistair’s Private Library',
        description: 'Official legal document bequeathing the entire Blackwood estate to the Royal Astronomical Society.',
        details: 'Scheduled to be signed at 11:30 PM tonight in the presence of the family lawyer. With Alistair dead before midnight, the old 1925 will granting Eleanor everything remains legally binding!',
        discovered: false,
        relatedSuspectId: 'eleanor-blackwood',
        contradictionHint: 'Provides the decisive timing motive: Eleanor had to strike before the midnight appointment.'
      },
      {
        id: 'clue-disinheritance-letter',
        name: 'Player Piano Roll Mechanism Note',
        category: 'document',
        importance: 'key',
        locationId: 'library-study',
        locationName: 'Lord Alistair’s Private Library',
        description: 'A receipt for an automated pneumatic piano roll mechanism installed inside the Steinway grand piano.',
        details: 'Proves Lady Eleanor did not have to physically sit at the piano to play Chopin—the automated roll played the Nocturne while she ascended the private service stairs to the tower!',
        discovered: false,
        relatedSuspectId: 'eleanor-blackwood',
        contradictionHint: 'Directly shatters Lady Eleanor’s musical alibi.'
      },
      {
        id: 'clue-botanical-extract',
        name: 'Concentrated Curare Derivative',
        category: 'toxicology',
        importance: 'supporting',
        locationId: 'conservatory',
        locationName: 'Victorian Glass Conservatory',
        description: 'A botanical solvent that causes instant vocal cord and muscular paralysis.',
        details: 'Explains why Lord Alistair did not cry out when attacked in the tower.',
        discovered: false,
        relatedSuspectId: 'dr-gideon-cross'
      }
    ],
    timeline: [
      {
        id: 't-1',
        time: '09:30 PM',
        description: 'Lord Alistair announces at dinner that the new will leaves the estate to the University.',
        location: 'Dining Hall',
        verified: true
      },
      {
        id: 't-2',
        time: '10:00 PM',
        description: 'Lord Alistair retreats to the Observatory to stargaze and prepare the signing documents.',
        location: 'Observatory',
        verified: true
      },
      {
        id: 't-3',
        time: '10:15 PM',
        description: 'Chopin’s Nocturne begins playing continuously from the drawing room.',
        location: 'Drawing Room',
        suspectId: 'eleanor-blackwood',
        suspectName: 'Lady Eleanor Blackwood',
        isContradiction: true,
        verified: false
      },
      {
        id: 't-4',
        time: '10:30 PM',
        description: 'Eleanor ascends the hidden spiral service stair, enters observatory, strikes Lord Alistair, and locks the bolt via exterior wire rig.',
        location: 'Observatory Terrace',
        suspectId: 'eleanor-blackwood',
        suspectName: 'Lady Eleanor Blackwood',
        isContradiction: true,
        verified: false
      },
      {
        id: 't-5',
        time: '10:45 PM',
        description: 'The heavy brass telescope counterweight falls, creating the thunderous crash that alerts the household.',
        location: 'Observatory',
        verified: true
      }
    ],
    solution: {
      culpritId: 'eleanor-blackwood',
      culpritName: 'Lady Eleanor Blackwood',
      murderWeapon: 'Obsidian ritual blade with curare coating, locked via steel pulley rig',
      trueMotive: 'To prevent Lord Alistair from signing his new will at 11:30 PM, which would have left her with only £100 instead of the £500,000 fortune.',
      howAlibiWasBroken: 'Her piano alibi was exposed by the automated player-roll receipt in the study, while the steel wire and pulley discovered on the roof gutter explained how the door was bolted from the outside.',
      fullEpilogue: 'Confronted with the pneumatic piano roll receipt and the steel wire mechanism still threaded through the roof gutter, Lady Eleanor drops her veil of sorrow. Her icy composure cracks: "Alistair thought he could discard me like an old astronomy ledger after eight years of devotion! I built this estate’s prestige!" The local constabulary arrives through the storm to take her into custody. You have outsmarted the Blackwood locked room!'
    },
    partyRounds: [
      {
        roundNumber: 1,
        title: 'The Crash in the Tower',
        gmNarration: 'Lightning flashes across the jagged Cornwall cliffs. A dreadful crash echoes from the high observatory tower. The master of Blackwood Manor is dead inside a room sealed from within. The will reading is in jeopardy!',
        objectives: [
          'Examine the victim’s body and the baffling locked-room state.',
          'Review the suspects’ whereabouts between 10:00 PM and 10:45 PM.',
          'Search the Observatory and Library for secret mechanisms.'
        ],
        publicClueReveal: 'The door to the observatory had to be axed open by the groundskeeper because the iron bolt was thrown from inside.',
        suspectActions: [
          {
            suspectId: 'eleanor-blackwood',
            privatePrompt: 'Insist that you were playing Chopin at the piano the entire time. Remind everyone that Alistair had many enemies among his occult rivals.'
          },
          {
            suspectId: 'charles-blackwood',
            privatePrompt: 'Act defensive about your debts, but swear on your life you never went near the tower.'
          },
          {
            suspectId: 'dr-gideon-cross',
            privatePrompt: 'Point out the unusual botanical smell in the air and suggest someone misused his botanical research.'
          }
        ]
      },
      {
        roundNumber: 2,
        title: 'The Wire & The Piano Roll',
        gmNarration: 'A close inspection of the piano and the stone roof reveals shocking technological deception. Someone planned this murder with mechanical precision.',
        objectives: [
          'Analyze the piano roll timing mechanism.',
          'Trace the steel wire from the roof balustrade.',
          'Uncover who benefited most from the timing of Alistair’s death.'
        ],
        publicClueReveal: 'A hidden wire was found threaded through the dome shutter to manipulate the internal latch.',
        suspectActions: []
      },
      {
        roundNumber: 3,
        title: 'The Final Indictment',
        gmNarration: 'The storm clears over Blackwood Cliff. The Game Master demands the true story of how the locked room was breached and who wielded the obsidian blade.',
        objectives: [
          'Deliver player indictments.',
          'Reveal the mastermind behind the locked-room murder.'
        ],
        suspectActions: []
      }
    ]
  },
  {
    id: 'silicon-slopes',
    title: 'Silicon Slopes Cyber-Penthouse',
    subtitle: 'A high-tech billionaire smart-penthouse assassination during a server blackout',
    era: '2026, Cyber-Noir Tech Thriller',
    setting: 'The Apex Penthouse Suite, 54th Floor, San Francisco / Silicon Valley',
    difficulty: 'Detective',
    estimatedTime: '20-25 min',
    summary: 'Tech visionary and founder of Aether AI, Vance Calloway, was found dead in his cryo-oxygen bio-chamber during an unexplainable 8-minute IoT lockdown. The biometric sensors recorded a lethal surge of carbon monoxide and insulin overdrive, yet the penthouse mainframe claims no unauthorized human entered.',
    victim: {
      name: 'Vance Calloway',
      title: 'Founder & CEO of Aether Neural Systems',
      age: 43,
      backstory: 'Billionaire tech mogul on the verge of releasing Aether-9, a transformative neural synthesis system. Known for cutthroat IP acquisition and firing founders.',
      causeOfDeath: 'Acute carbon monoxide suffocation combined with an insulin dosing override in his smart biometric pod',
      timeOfDeath: '11:42 PM - 11:50 PM',
      locationFound: 'Apex Master Suite Bio-Pod Chamber',
      autopsyNotes: 'Toxicology confirms deadly insulin injection paired with hacked atmospheric oxygen filtration in the pod.'
    },
    rooms: [
      {
        id: 'bio-chamber',
        name: 'The Cryo-Oxygen Bio-Chamber',
        description: 'A minimalist glass-and-titanium pod chamber overlooking the San Francisco skyline.',
        atmosphere: 'The low hum of cooling fans. Digital warning telemetry glowing red on HUD glass.',
        searched: false,
        itemsToSearch: [
          {
            id: 'search-pod-console',
            name: 'Bio-Pod Control Interface & Dosing Port',
            description: 'Inspect the neural telemetry logs and chemical injector module.',
            clueId: 'clue-pod-override-usb',
            searched: false
          }
        ]
      },
      {
        id: 'server-hub',
        name: 'Private Server Core & Network Vault',
        description: 'A subterranean server rack room behind a biometric iris scanner.',
        atmosphere: 'Cold air blasting from floor vents. Fiber optic cables pulsating blue.',
        searched: false,
        itemsToSearch: [
          {
            id: 'search-terminal-logs',
            name: 'Mainframe Access Terminal',
            description: 'Extract raw syslog and network packet dumps during the 8-minute blackout.',
            clueId: 'clue-firmware-patch',
            searched: false
          }
        ]
      },
      {
        id: 'lounge-terrace',
        name: 'Skyline Terrace & Bar',
        description: 'Infinity pool deck cantilevered 54 stories above the city fog.',
        atmosphere: 'Wind whipping around glass balustrades. Half-empty glasses of craft sake.',
        searched: false,
        itemsToSearch: [
          {
            id: 'search-smart-glasses',
            name: 'Discarded AR Smart Glasses',
            description: 'Examine the AR glasses found resting on the teak lounge table.',
            clueId: 'clue-ar-recording',
            searched: false
          }
        ]
      }
    ],
    suspects: [
      {
        id: 'maya-lin',
        name: 'Dr. Maya Lin',
        role: 'Chief AI Architect & Co-Founder',
        age: 36,
        avatarSeed: 'maya',
        personality: 'Brilliant, stoic, analytical, speaks with calm precision.',
        occupation: 'VP of Neural Architecture',
        relationToVictim: 'Co-founded Aether; Vance secretly forced a board vote to strip her of all equity and claim sole patent ownership tomorrow.',
        publicAlibi: 'Claims she was in the server core debugging the Aether-9 model weights from 11:30 PM to midnight.',
        secret: 'She coded a rootkit backdoor into the bio-pod firmware three weeks ago and triggered the lethal override from her encrypted wearable terminal during the blackout.',
        secretUnlocked: false,
        motive: 'Vance stole her life’s work and was about to erase her name from the landmark AI patent.',
        stressLevel: 30,
        suspiciousnessRating: 5,
        isCulprit: true,
        dialogueHistory: [
          {
            id: 'init-maya',
            sender: 'suspect',
            text: 'Vance’s bio-pod was isolated on an air-gapped VLAN. For someone to override the atmospheric mix and insulin safety limits required cryptographic private keys only three people possessed.',
            timestamp: '12:15 AM'
          }
        ],
        keyQuotes: [
          'Vance took credit for every algorithm I wrote over the past seven years.',
          'Look at the cryptographic hash. The truth is always in the code.'
        ]
      },
      {
        id: 'devon-ross',
        name: 'Devon Ross',
        role: 'Venture Capital Lead & Board Chairman',
        age: 49,
        avatarSeed: 'devon',
        personality: 'Polished, aggressive, constantly checking stock futures on his smart ring.',
        occupation: 'Managing Partner, Apex Capital',
        relationToVictim: 'Invested $200M; discovered Vance was secretly embezzling funds into offshore crypto wallets.',
        publicAlibi: 'Was on a video call with Tokyo investors on the skyline terrace from 11:35 PM to 11:55 PM.',
        secret: 'He was threatening Vance with federal wire fraud charges if he didn’t resign as CEO by morning.',
        secretUnlocked: false,
        motive: 'To salvage the company’s $10B IPO before Vance’s embezzlement became public.',
        stressLevel: 45,
        suspiciousnessRating: 3,
        isCulprit: false,
        dialogueHistory: [
          {
            id: 'init-devon',
            sender: 'suspect',
            text: 'I wanted Vance out of the CEO chair, not dead! If the CEO dies hours before our SEC filing, Apex Capital loses half a billion in valuation!',
            timestamp: '12:20 AM'
          }
        ],
        keyQuotes: [
          'I had the Tokyo conference call streaming in high definition. Check the server timestamps.',
          'Maya was the only one who understood every line of the bio-pod’s telemetry kernel.'
        ]
      }
    ],
    clues: [
      {
        id: 'clue-pod-override-usb',
        name: 'Encrypted Hardware Key with Custom Kernel',
        category: 'digital',
        importance: 'key',
        locationId: 'bio-chamber',
        locationName: 'The Cryo-Oxygen Bio-Chamber',
        description: 'A physical cryptographic YubiKey plugged into the rear service diagnostics bus of the bio-pod.',
        details: 'Signed with Dr. Maya Lin’s unique developer certificate: SHA-256 (0x7F9A...LIN). The script executed a remote payload command at 11:43 PM.',
        discovered: false,
        relatedSuspectId: 'maya-lin',
        contradictionHint: 'Directly links Maya’s private developer credentials to the execution of the lethal bio-chamber override.'
      },
      {
        id: 'clue-firmware-patch',
        name: 'Hostile Equity Transfer & Patent Agreement',
        category: 'document',
        importance: 'supporting',
        locationId: 'server-hub',
        locationName: 'Private Server Core & Network Vault',
        description: 'Unsent board resolution draft dated for 09:00 AM tomorrow, terminating Maya Lin with cause and reassigning all 14 patents to Vance exclusively.',
        details: 'Confirms the impending catastrophe Maya faced if Vance lived until morning.',
        discovered: false,
        relatedSuspectId: 'maya-lin'
      },
      {
        id: 'clue-ar-recording',
        name: 'AR Glasses Video Buffer',
        category: 'digital',
        importance: 'supporting',
        locationId: 'lounge-terrace',
        locationName: 'Skyline Terrace & Bar',
        description: 'Video cache confirming Devon Ross was on a live video conference with Tokyo during the exact window of the murder.',
        details: 'Clears Devon Ross of physically tampering with any hardware during the murder.',
        discovered: false,
        relatedSuspectId: 'devon-ross'
      }
    ],
    timeline: [
      {
        id: 'st-1',
        time: '11:15 PM',
        description: 'Vance Calloway enters his smart bio-pod for his nightly regenerative cycle.',
        location: 'Bio-Chamber',
        verified: true
      },
      {
        id: 'st-2',
        time: '11:35 PM',
        description: 'Devon Ross begins video call with Tokyo investors on the terrace.',
        location: 'Terrace',
        suspectId: 'devon-ross',
        suspectName: 'Devon Ross',
        verified: true
      },
      {
        id: 'st-3',
        time: '11:42 PM',
        description: 'Network blackout initiated. Maya Lin transmits remote kernel override to bio-pod.',
        location: 'Server Core',
        suspectId: 'maya-lin',
        suspectName: 'Dr. Maya Lin',
        isContradiction: true,
        verified: false
      },
      {
        id: 'st-4',
        time: '11:55 PM',
        description: 'Automated bio-pod distress telemetry alerts penthouse security.',
        location: 'Bio-Chamber',
        verified: true
      }
    ],
    solution: {
      culpritId: 'maya-lin',
      culpritName: 'Dr. Maya Lin',
      murderWeapon: 'Cryptographic bio-pod firmware rootkit delivering lethal carbon monoxide and insulin surge',
      trueMotive: 'Vance Calloway was holding a secret board meeting at 9:00 AM to strip Maya of her co-founder equity and steal credit for all 14 of her neural AI patents.',
      howAlibiWasBroken: 'The cryptographic hardware key plugged into the diagnostics port contained her personal private certificate signature, while the server packet logs pinpointed the override script originating from her terminal during the blackout.',
      fullEpilogue: 'Presented with the SHA-256 cryptographic signature and the patent theft documents, Dr. Maya Lin slowly takes off her glasses. "Vance was a marketing vampire," she says without a trace of remorse. "He never wrote a single neural layer. He thought he could steal my mind and cast me aside. In code, every action has an immutable log." She is escorted away by federal cyber forensics teams.'
    },
    partyRounds: [
      {
        roundNumber: 1,
        title: 'The Blackout at 54 Stories',
        gmNarration: 'The smart lights pulse red. The ultra-wealthy founder lies dead in his high-tech capsule. The AI mainframe has logged an unnatural surge. Who among the leadership team held the keys to the kingdom?',
        objectives: [
          'Examine the victim’s bio-pod telemetry.',
          'Review the suspects’ digital footprints.',
          'Identify who had the technical expertise to orchestrate the hack.'
        ],
        publicClueReveal: 'The bio-pod was breached via internal cryptographic developer keys, not an outside hacker.',
        suspectActions: []
      },
      {
        roundNumber: 2,
        title: 'Decryption & Motive',
        gmNarration: 'As packet logs are reconstructed, the personal betrayals behind the corporate facade come to light.',
        objectives: [
          'Extract the board meeting documents.',
          'Confront the suspects with certificate keys.'
        ],
        publicClueReveal: 'A patent transfer resolution was scheduled for the morning board meeting.',
        suspectActions: []
      },
      {
        roundNumber: 3,
        title: 'The Cyber Indictment',
        gmNarration: 'The Game Master demands the identity of the digital assassin.',
        objectives: ['Submit final accusations and reveal the verdict.'],
        suspectActions: []
      }
    ]
  }
];
