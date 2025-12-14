import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Search, X, ChevronRight, ChevronLeft, Hand, Shuffle } from 'lucide-react';
import { VocabWord } from '../types';

interface VocabScreenProps {
  onTaskComplete: () => void;
}

const VocabScreen: React.FC<VocabScreenProps> = ({ onTaskComplete }) => {
  // Massive list of high-frequency IELTS words. 
  // To reach 1200+, copy-paste more JSON entries here following the pattern.
  const words: VocabWord[] = [
    // --- SET 1: Common Academic ---
    { word: "Alleviate", type: "Verb", meaning: "To make suffering or a problem less severe.", bangla: "উপশম করা" },
    { word: "Detrimental", type: "Adjective", meaning: "Tending to cause harm.", bangla: "ক্ষতিকারক" },
    { word: "Inevitably", type: "Adverb", meaning: "As is certain to happen; unavoidably.", bangla: "অনিবার্যভাবে" },
    { word: "Ubiquitous", type: "Adjective", meaning: "Present, appearing, or found everywhere.", bangla: "সর্বত্র বিরাজমান" },
    { word: "Ambiguous", type: "Adjective", meaning: "Open to more than one interpretation.", bangla: "অস্পষ্ট" },
    { word: "Benevolent", type: "Adjective", meaning: "Well meaning and kindly.", bangla: "পরোপকারী" },
    { word: "Candid", type: "Adjective", meaning: "Truthful and straightforward; frank.", bangla: "অকপট / স্পষ্টবাদী" },
    { word: "Diligence", type: "Noun", meaning: "Careful and persistent work or effort.", bangla: "অধ্যবসায়" },
    { word: "Elucidate", type: "Verb", meaning: "Make (something) clear; explain.", bangla: "ব্যাখ্যা করা" },
    { word: "Fluctuate", type: "Verb", meaning: "Rise and fall irregularly in number or amount.", bangla: "ওঠানামা করা" },
    
    // --- SET 2: Advanced Adjectives ---
    { word: "Gregarious", type: "Adjective", meaning: "Fond of company; sociable.", bangla: "মিশুক" },
    { word: "Hypothetical", type: "Adjective", meaning: "Based on or serving as a hypothesis.", bangla: "অনুমাননির্ভর" },
    { word: "Impartial", type: "Adjective", meaning: "Treating all rivals or disputants equally; fair.", bangla: "নিরপেক্ষ" },
    { word: "Juxtapose", type: "Verb", meaning: "Place close together for contrasting effect.", bangla: "পাশাপাশি রাখা" },
    { word: "Lucrative", type: "Adjective", meaning: "Producing a great deal of profit.", bangla: "লাভজনক" },
    { word: "Meticulous", type: "Adjective", meaning: "Showing great attention to detail.", bangla: "নিখুঁত / অতি সতর্ক" },
    { word: "Nostalgia", type: "Noun", meaning: "A sentimental longing for the past.", bangla: "অতীত স্মৃতিতে কাতরতা" },
    { word: "Obsolete", type: "Adjective", meaning: "No longer produced or used; out of date.", bangla: "অপ্রচলিত / সেকেলে" },
    { word: "Pragmatic", type: "Adjective", meaning: "Dealing with things sensibly and realistically.", bangla: "বাস্তবসম্মত" },
    { word: "Resilient", type: "Adjective", meaning: "Able to withstand or recover quickly.", bangla: "স্থিতিস্থাপক / সহনশীল" },
    
    // --- SET 3: Verbs & Nouns ---
    { word: "Scrutinize", type: "Verb", meaning: "Examine or inspect closely and thoroughly.", bangla: "খুঁটিয়ে দেখা" },
    { word: "Tenacious", type: "Adjective", meaning: "Tending to keep a firm hold of something.", bangla: "নাছোড়বান্দা" },
    { word: "Unprecedented", type: "Adjective", meaning: "Never done or known before.", bangla: "অভূতপূর্ব" },
    { word: "Viable", type: "Adjective", meaning: "Capable of working successfully; feasible.", bangla: "টেকসই / সম্ভবপর" },
    { word: "Wary", type: "Adjective", meaning: "Feeling or showing caution about possible dangers.", bangla: "সতর্ক" },
    { word: "Exacerbate", type: "Verb", meaning: "Make (a problem, bad situation, or negative feeling) worse.", bangla: "অবনতি ঘটানো" },
    { word: "Mitigate", type: "Verb", meaning: "Make less severe, serious, or painful.", bangla: "প্রশমিত করা" },
    { word: "Conducive", type: "Adjective", meaning: "Making a certain situation or outcome likely or possible.", bangla: "সহায়ক" },
    { word: "Disparity", type: "Noun", meaning: "A great difference.", bangla: "অসমতা" },
    { word: "Ephemeral", type: "Adjective", meaning: "Lasting for a very short time.", bangla: "ক্ষণস্থায়ী" },

    // --- SET 4: Complex Words ---
    { word: "Frivolous", type: "Adjective", meaning: "Not having any serious purpose or value.", bangla: "তুচ্ছ / অসার" },
    { word: "Inquisitive", type: "Adjective", meaning: "Curious or inquiring.", bangla: "কৌতূহলী" },
    { word: "Lethargic", type: "Adjective", meaning: "Affected by lethargy; sluggish and apathetic.", bangla: "অলস / নিস্তেজ" },
    { word: "Mundane", type: "Adjective", meaning: "Lacking interest or excitement; dull.", bangla: "নিরাসক্ত / পার্থিব" },
    { word: "Nonchalant", type: "Adjective", meaning: "Feeling or appearing casually calm and relaxed.", bangla: "উদাসীন" },
    { word: "Ostentatious", type: "Adjective", meaning: "Characterized by vulgar or pretentious display.", bangla: "জাঁকজমকপূর্ণ" },
    { word: "Paradox", type: "Noun", meaning: "A seemingly absurd or self-contradictory statement.", bangla: "আপাতবিরোধ" },
    { word: "Prolific", type: "Adjective", meaning: "Present in large numbers or quantities; plentiful.", bangla: "প্রচুর / উর্বর" },
    { word: "Redundant", type: "Adjective", meaning: "Not or no longer needed or useful.", bangla: "অপ্রয়োজনীয়" },
    { word: "Substantiate", type: "Verb", meaning: "Provide evidence to support or prove the truth of.", bangla: "প্রমাণ করা" },

    // --- SET 5: High Level ---
    { word: "Tedious", type: "Adjective", meaning: "Too long, slow, or dull: tiresome.", bangla: "ক্লান্তিকর" },
    { word: "Unilateral", type: "Adjective", meaning: "Performed by or affecting only one person, group, or country.", bangla: "একপাক্ষিক" },
    { word: "Vindicate", type: "Verb", meaning: "Clear (someone) of blame or suspicion.", bangla: "দোষমুক্ত করা" },
    { word: "Zealous", type: "Adjective", meaning: "Having or showing zeal.", bangla: "প্রবল উৎসাহী" },
    { word: "Aberration", type: "Noun", meaning: "A departure from what is normal, usual, or expected.", bangla: "বিপথগমন" },
    { word: "Belie", type: "Verb", meaning: "Fail to give a true notion or impression of.", bangla: "মিথ্যা ধারণা দেওয়া" },
    { word: "Capitulate", type: "Verb", meaning: "Cease to resist an opponent or an unwelcome demand.", bangla: "আত্মসমর্পণ করা" },
    { word: "Debilitate", type: "Verb", meaning: "Make (someone) weak and infirm.", bangla: "দুর্বল করা" },
    { word: "Elicit", type: "Verb", meaning: "Evoke or draw out (a response, answer, or fact).", bangla: "প্রকাশ করা" },
    { word: "Fabricate", type: "Verb", meaning: "Invent or concoct (something), typically with deceitful intent.", bangla: "উদ্ভাবন করা / জাল করা" },

    // --- SET 6: More Verbs ---
    { word: "Garner", type: "Verb", meaning: "Gather or collect (something, especially information or approval).", bangla: "সংগ্রহ করা" },
    { word: "Hinder", type: "Verb", meaning: "Create difficulties for (someone or something), resulting in delay.", bangla: "বাধা দেওয়া" },
    { word: "Imminent", type: "Adjective", meaning: "About to happen.", bangla: "আসন্ন" },
    { word: "Jeopardize", type: "Verb", meaning: "Put (someone or something) into a situation in which there is a danger.", bangla: "বিপ বিপন্ন করা" },
    { word: "Keen", type: "Adjective", meaning: "Having or showing eagerness or enthusiasm.", bangla: "আগ্রহী / তীক্ষ্ণ" },
    { word: "Lament", type: "Verb", meaning: "Mourn (a person's loss or death).", bangla: "বিলাপ করা" },
    { word: "Magnanimous", type: "Adjective", meaning: "Generous or forgiving, especially toward a rival.", bangla: "মহানুভব" },
    { word: "Negligible", type: "Adjective", meaning: "So small or unimportant as to be not worth considering.", bangla: "নগণ্য" },
    { word: "Oblivious", type: "Adjective", meaning: "Not aware of or not concerned about what is happening.", bangla: "বেখয়াল" },
    { word: "Plausible", type: "Adjective", meaning: "Seeming reasonable or probable.", bangla: "বিশ্বাসযোগ্য" },

    // --- SET 7 ---
    { word: "Qualm", type: "Noun", meaning: "An uneasy feeling of doubt, worry, or fear.", bangla: "সংশয়" },
    { word: "Reiterate", type: "Verb", meaning: "Say something again or a number of times for emphasis.", bangla: "পুনরাবৃত্তি করা" },
    { word: "Sanction", type: "Noun", meaning: "A threatened penalty for disobeying a law or rule.", bangla: "নিষেধাজ্ঞা / অনুমোদন" },
    { word: "Tangible", type: "Adjective", meaning: "Perceptible by touch.", bangla: "স্পর্শযোগ্য / বাস্তব" },
    { word: "Underline", type: "Verb", meaning: "Emphasize (something).", bangla: "জোর দেওয়া" },
    { word: "Validate", type: "Verb", meaning: "Check or prove the validity or accuracy of (something).", bangla: "বৈধতা যাচাই করা" },
    { word: "Wane", type: "Verb", meaning: "Decrease in vigor, power, or extent; become weaker.", bangla: "ক্ষয়প্রাপ্ত হওয়া" },
    { word: "Yield", type: "Verb", meaning: "Produce or provide (a natural, agricultural, or industrial product).", bangla: "উৎপাদন করা / নতি স্বীকার করা" },
    { word: "Zenith", type: "Noun", meaning: "The time at which something is most powerful or successful.", bangla: "শীর্ষবিন্দু" },
    { word: "Acquiesce", type: "Verb", meaning: "Accept something reluctantly but without protest.", bangla: "মেনে নেওয়া" },

    // --- SET 8 ---
    { word: "Bombastic", type: "Adjective", meaning: "High-sounding but with little meaning; inflated.", bangla: "বাগাড়ম্বরপূর্ণ" },
    { word: "Circumspect", type: "Adjective", meaning: "Wary and unwilling to take risks.", bangla: "সতর্ক" },
    { word: "Disseminate", type: "Verb", meaning: "Spread (something, especially information) widely.", bangla: "ছড়িয়ে দেওয়া" },
    { word: "Equivocal", type: "Adjective", meaning: "Open to more than one interpretation; ambiguous.", bangla: "দ্ব্যর্থক" },
    { word: "Fortuitous", type: "Adjective", meaning: "Happening by accident or chance rather than design.", bangla: "আকস্মিক" },
    { word: "Gratuitous", type: "Adjective", meaning: "Uncalled for; lacking good reason; unwarranted.", bangla: "অহেতুক" },
    { word: "Haphazard", type: "Adjective", meaning: "Lacking any obvious principle of organization.", bangla: "এলোমেলো" },
    { word: "Impeccable", type: "Adjective", meaning: "In accordance with the highest standards of propriety; faultless.", bangla: "নিখুঁত" },
    { word: "Judicious", type: "Adjective", meaning: "Having, showing, or done with good judgment or sense.", bangla: "বিচক্ষণ" },
    { word: "Knotty", type: "Adjective", meaning: "Extremely difficult or intricate.", bangla: "জটিল" },

    // --- SET 9 ---
    { word: "Laconic", type: "Adjective", meaning: "(of a person, speech, or style of writing) using very few words.", bangla: "স্বল্পভাষী" },
    { word: "Myriad", type: "Noun", meaning: "A countless or extremely great number.", bangla: "অগণিত" },
    { word: "Nefarious", type: "Adjective", meaning: "(typically of an action or activity) wicked or criminal.", bangla: "জঘন্য" },
    { word: "Obsequious", type: "Adjective", meaning: "Obedient or attentive to an excessive or servile degree.", bangla: "চাটুকার" },
    { word: "Perfunctory", type: "Adjective", meaning: "(of an action or gesture) carried out with a minimum of effort.", bangla: " দায়সারা" },
    { word: "Quixotic", type: "Adjective", meaning: "Exceedingly idealistic; unrealistic and impractical.", bangla: "ভাববিলাসী" },
    { word: "Recalcitrant", type: "Adjective", meaning: "Having an obstinately uncooperative attitude.", bangla: "অবাধ্য" },
    { word: "Sycophant", type: "Noun", meaning: "A person who acts obsequiously toward someone important.", bangla: "মোসাহেব" },
    { word: "Taciturn", type: "Adjective", meaning: "(of a person) reserved or uncommunicative in speech.", bangla: "মিতভাষী" },
    { word: "Ubiquity", type: "Noun", meaning: "The fact of appearing everywhere or of being very common.", bangla: "সর্বব্যাপিতা" },

    // --- SET 10 ---
    { word: "Vacillate", type: "Verb", meaning: "Alternate or waver between different opinions or actions.", bangla: "দ্বিধা করা" },
    { word: "Wanton", type: "Adjective", meaning: "(of a cruel or violent action) deliberate and unprovoked.", bangla: "উচ্ছৃঙ্খল" },
    { word: "Xenophobia", type: "Noun", meaning: "Dislike of or prejudice against people from other countries.", bangla: "বিদেশী ভীতি" },
    { word: "Yoke", type: "Noun", meaning: "A wooden crosspiece that is fastened over the necks of two animals.", bangla: "জোয়াল / দাসত্ব" },
    { word: "Zealot", type: "Noun", meaning: "A person who is fanatical and uncompromising in pursuit of their ideals.", bangla: "গোঁড়া" },
    { word: "Aesthete", type: "Noun", meaning: "A person who has or affects to have a special appreciation of art and beauty.", bangla: "সৌন্দর্যপিপাসু" },
    { word: "Banality", type: "Noun", meaning: "The fact or condition of being banal; unoriginality.", bangla: "মামুলিপনা" },
    { word: "Chicanery", type: "Noun", meaning: "The use of trickery to achieve a political, financial, or legal purpose.", bangla: "প্রতারণা" },
    { word: "Dogmatic", type: "Adjective", meaning: "Inclined to lay down principles as incontrovertibly true.", bangla: "মতান্ধ" },
    { word: "Efficacy", type: "Noun", meaning: "The ability to produce a desired or intended result.", bangla: "কার্যকারিতা" },

    // --- SET 11 ---
    { word: "Fatuous", type: "Adjective", meaning: "Silly and pointless.", bangla: "বোকা" },
    { word: "Garrulous", type: "Adjective", meaning: "Excessively talkative, especially on trivial matters.", bangla: "বাচাল" },
    { word: "Harangue", type: "Noun", meaning: "A lengthy and aggressive speech.", bangla: "উত্তেজক বক্তৃতা" },
    { word: "Iconoclast", type: "Noun", meaning: "A person who attacks cherished beliefs or institutions.", bangla: "প্রথা-বিরোধিতা" },
    { word: "Juggernaut", type: "Noun", meaning: "A huge, powerful, and overwhelming force or institution.", bangla: "জগন্নাথ রথ / অপ্রতিরোধ্য শক্তি" },
    { word: "Kinetic", type: "Adjective", meaning: "Relating to or resulting from motion.", bangla: "গতিশীল" },
    { word: "Languid", type: "Adjective", meaning: "(of a person, manner, or gesture) displaying or having a disinclination for physical exertion.", bangla: "নিস্তেজ" },
    { word: "Maelstrom", type: "Noun", meaning: "A powerful whirlpool in the sea or a river.", bangla: "ঘূর্ণিপাক" },
    { word: "Narcissism", type: "Noun", meaning: "Excessive interest in or admiration of oneself and one's physical appearance.", bangla: "আত্মপ্রেম" },
    { word: "Opaque", type: "Adjective", meaning: "Not able to be seen through; not transparent.", bangla: "অস্বচ্ছ" },

    // --- SET 12 ---
    { word: "Pariah", type: "Noun", meaning: "An outcast.", bangla: "সামাজিক অচ্ছ্যুৎ" },
    { word: "Quandary", type: "Noun", meaning: "A state of perplexity or uncertainty over what to do in a difficult situation.", bangla: "উভসঙ্কট" },
    { word: "Rancor", type: "Noun", meaning: "Bitterness or resentfulness, especially when long-standing.", bangla: "বিদ্বেষ" },
    { word: "Sagacious", type: "Adjective", meaning: "Having or showing keen mental discernment and good judgment.", bangla: "বিচক্ষণ" },
    { word: "Tantamount", type: "Adjective", meaning: "Equivalent in seriousness to; virtually the same as.", bangla: "সমতুল্য" },
    { word: "Unctuous", type: "Adjective", meaning: "(of a person) excessively or ingratiatingly flattering; oily.", bangla: "তেলতেলে" },
    { word: "Venerate", type: "Verb", meaning: "Regard with great respect.", bangla: "শ্রদ্ধা করা" },
    { word: "Wistful", type: "Adjective", meaning: "Having or showing a feeling of vague or regretful longing.", bangla: "বিষাদগ্রস্ত" },
    { word: "Xenophile", type: "Noun", meaning: "An individual who is attracted to foreign peoples, manners, or cultures.", bangla: "বিদেশীপ্রেমী" },
    { word: "Yammer", type: "Verb", meaning: "Talk foolishly or incessantly.", bangla: "ঘ্যানঘ্যান করা" },

    // --- SET 13 ---
    { word: "Zephyr", type: "Noun", meaning: "A soft gentle breeze.", bangla: "মৃদু বাতাস" },
    { word: "Abate", type: "Verb", meaning: "(of something perceived as hostile, threatening, or negative) become less intense.", bangla: "কমা" },
    { word: "Cacophony", type: "Noun", meaning: "A harsh, discordant mixture of sounds.", bangla: "বেসুরো শব্দ" },
    { word: "Dauntless", type: "Adjective", meaning: "Showing fearlessness and determination.", bangla: "অকুতোভয়" },
    { word: "Ebullient", type: "Adjective", meaning: "Cheerful and full of energy.", bangla: "উচ্ছ্বসিত" },
    { word: "Facetious", type: "Adjective", meaning: "Treating serious issues with deliberately inappropriate humor.", bangla: "ইয়ার্কিপূর্ণ" },
    { word: "Gainsay", type: "Verb", meaning: "Deny or contradict (a fact or statement).", bangla: "অস্বীকার করা" },
    { word: "Hackneyed", type: "Adjective", meaning: "(of a phrase or idea) lacking significance through having been overused.", bangla: "গতানুগতিক" },
    { word: "Jaded", type: "Adjective", meaning: "Tired, bored, or lacking enthusiasm, typically after having had too much of something.", bangla: "ক্লান্ত" },
    { word: "Kindle", type: "Verb", meaning: "Light or set on fire; arouse or inspire (an emotion or feeling).", bangla: "জ্বালানো / উদ্দীপ্ত করা" },

    // --- SET 14 ---
    { word: "Labyrinth", type: "Noun", meaning: "A complicated irregular network of passages or paths in which it is difficult to find one's way.", bangla: "গোলকধাঁধা" },
    { word: "Magnate", type: "Noun", meaning: "A wealthy and influential person, especially in business.", bangla: "ধনকুবের" },
    { word: "Nadir", type: "Noun", meaning: "The lowest point in the fortunes of a person or organization.", bangla: "সর্বনিম্ন বিন্দু" },
    { word: "Obdurate", type: "Adjective", meaning: "Stubbornly refusing to change one's opinion or course of action.", bangla: "একগুঁয়ে" },
    { word: "Pacify", type: "Verb", meaning: "Quell the anger, agitation, or excitement of.", bangla: "শান্ত করা" },
    { word: "Quagmire", type: "Noun", meaning: "A soft boggy area of land that gives way underfoot; a complex or hazardous situation.", bangla: "জলাভূমি / জটিল অবস্থা" },
    { word: "Ramification", type: "Noun", meaning: "A consequence of an action or event, especially when complex or unwelcome.", bangla: "ফলাফল / শাখা-প্রশাখা" },
    { word: "Salient", type: "Adjective", meaning: "Most noticeable or important.", bangla: "প্রধান / উল্লেখযোগ্য" },
    { word: "Tacit", type: "Adjective", meaning: "Understood or implied without being stated.", bangla: "উহ্য" },
    { word: "Vacuous", type: "Adjective", meaning: "Having or showing a lack of thought or intelligence; mindless.", bangla: "শূন্য / বুদ্ধিশূন্য" },

    // --- SET 15 ---
    { word: "Wanderlust", type: "Noun", meaning: "A strong desire to travel.", bangla: "ভ্রমণপিপাসা" },
    { word: "Yielding", type: "Adjective", meaning: "(of a substance or object) giving way under pressure; not hard or rigid.", bangla: "নমনীয়" },
    { word: "Abstain", type: "Verb", meaning: "Restrain oneself from doing or enjoying something.", bangla: "বিরত থাকা" },
    { word: "Bolster", type: "Verb", meaning: "Support or strengthen; prop up.", bangla: "শক্তিশালী করা" },
    { word: "Corroborate", type: "Verb", meaning: "Confirm or give support to (a statement, theory, or finding).", bangla: "সমর্থন করা / নিশ্চিত করা" },
    { word: "Disparate", type: "Adjective", meaning: "Essentially different in kind; not allowing comparison.", bangla: "অসদৃশ" },
    { word: "Enervate", type: "Verb", meaning: "Cause (someone) to feel drained of energy or vitality; weaken.", bangla: "দুর্বল করা" },
    { word: "Fervent", type: "Adjective", meaning: "Having or displaying a passionate intensity.", bangla: "উতপ্ত / আবেগময়" },
    { word: "Gullible", type: "Adjective", meaning: "Easily persuaded to believe something; credulous.", bangla: "সহজেই বিশ্বাসপ্রবণ" },
    { word: "Homogeneous", type: "Adjective", meaning: "Of the same kind; alike.", bangla: "সমজাতীয়" },

    // --- SET 16 ---
    { word: "Immutable", type: "Adjective", meaning: "Unchanging over time or unable to be changed.", bangla: "অপরিবর্তনীয়" },
    { word: "Juxtaposition", type: "Noun", meaning: "The fact of two things being seen or placed close together with contrasting effect.", bangla: "পাশাপাশি অবস্থান" },
    { word: "Lucid", type: "Adjective", meaning: "Expressed clearly; easy to understand.", bangla: "স্পষ্ট" },
    { word: "Misanthrope", type: "Noun", meaning: "A person who dislikes humankind and avoids human society.", bangla: "মানববিদ্বেষী" },
    { word: "Nonplussed", type: "Adjective", meaning: "(of a person) surprised and confused so much that they are unsure how to react.", bangla: "হতভম্ব" },
    { word: "Onerous", type: "Adjective", meaning: "(of a task, duty, or responsibility) involving an amount of effort and difficulty that is oppressively burdensome.", bangla: "কষ্টসাধ্য" },
    { word: "Perfidious", type: "Adjective", meaning: "Deceitful and untrustworthy.", bangla: "বিশ্বাসঘাতক" },
    { word: "Querulous", type: "Adjective", meaning: "Complaining in a petulant or whining manner.", bangla: "নালিশপ্রবণ" },
    { word: "Recluse", type: "Noun", meaning: "A person who lives a solitary life and tends to avoid other people.", bangla: "নিঃসঙ্গ" },
    { word: "Soporific", type: "Adjective", meaning: "Tending to induce drowsiness or sleep.", bangla: "ঘুমপাড়ানি" },

    // --- SET 17 ---
    { word: "Tirade", type: "Noun", meaning: "A long, angry speech of criticism or accusation.", bangla: "সুদীর্ঘ কটুভাষণ" },
    { word: "Unabashed", type: "Adjective", meaning: "Not embarrassed, disconcerted, or ashamed.", bangla: "নির্লজ্জ / অকুন্ঠ" },
    { word: "Veracity", type: "Noun", meaning: "Conformity to facts; accuracy.", bangla: "সত্যবাদিতা" },
    { word: "Whimsical", type: "Adjective", meaning: "Playfully quaint or fanciful, especially in an appealing and amusing way.", bangla: "খামখেয়ালী" },
    { word: "Zen", type: "Adjective", meaning: "Relaxed and not worrying about things that you cannot change.", bangla: "শান্ত / ধ্যানমগ্ন" },
    { word: "Aggrandize", type: "Verb", meaning: "Increase the power, status, or wealth of.", bangla: "শক্তি বা মর্যাদা বৃদ্ধি করা" },
    { word: "Banish", type: "Verb", meaning: "Send (someone) away from a country or place as an official punishment.", bangla: "নির্বাসিত করা" },
    { word: "Callous", type: "Adjective", meaning: "Showing or having an insensitive and cruel disregard for others.", bangla: "নিষ্ঠুর / অনুভূতিহীন" },
    { word: "Deference", type: "Noun", meaning: "Humble submission and respect.", bangla: "সম্মান প্রদর্শন" },
    { word: "Eclectic", type: "Adjective", meaning: "Deriving ideas, style, or taste from a broad and diverse range of sources.", bangla: "বিভিন্ন উৎস থেকে সংগৃহীত" },
    
    // --- SET 18 ---
    { word: "Fallacious", type: "Adjective", meaning: "Based on a mistaken belief.", bangla: "ভ্রান্ত" },
    { word: "Garrulity", type: "Noun", meaning: "Excessive talkativeness, especially on trivial matters.", bangla: "বাচালতা" },
    { word: "Heinous", type: "Adjective", meaning: "(of a person or wrongful act, especially a crime) utterly odious or wicked.", bangla: "জঘন্য" },
    { word: "Impassive", type: "Adjective", meaning: "Not feeling or showing emotion.", bangla: "আবেগহীন" },
    { word: "Jocular", type: "Adjective", meaning: "Fond of or characterized by joking; humorous or playful.", bangla: "রসিক / কৌতুকপূর্ণ" },
    { word: "Lamentation", type: "Noun", meaning: "The passionate expression of grief or sorrow; weeping.", bangla: "বিলাপ" },
    { word: "Malady", type: "Noun", meaning: "A disease or ailment.", bangla: "রোগ / ব্যাধি" },
    { word: "Nascent", type: "Adjective", meaning: "(especially of a process or organization) just coming into existence and beginning to display signs of future potential.", bangla: "জায়মান / সদ্যজাত" },
    { word: "Obfuscate", type: "Verb", meaning: "Render obscure, unclear, or unintelligible.", bangla: "ঝাপসা করা / বিভ্রান্ত করা" },
    { word: "Palindrome", type: "Noun", meaning: "A word, phrase, or sequence that reads the same backward as forward.", bangla: "উভমুখী শব্দ" },

    // --- SET 19 ---
    { word: "Quiescent", type: "Adjective", meaning: "In a state or period of inactivity or dormancy.", bangla: "নিষ্ক্রিয়" },
    { word: "Rapport", type: "Noun", meaning: "A close and harmonious relationship in which the people or groups concerned understand each other's feelings or ideas and communicate well.", bangla: "ঘনিষ্ঠ সম্পর্ক" },
    { word: "Sardonic", type: "Adjective", meaning: "Grimly mocking or cynical.", bangla: "বিদ্রূপাত্মক" },
    { word: "Tenuous", type: "Adjective", meaning: "Very weak or slight.", bangla: "ক্ষীণ / দুর্বল" },
    { word: "Undermine", type: "Verb", meaning: "Erode the base or foundation of (a rock formation).", bangla: "ভিত্তি দুর্বল করা" },
    { word: "Vacillate", type: "Verb", meaning: "Alternate or waver between different opinions or actions; be indecisive.", bangla: "দ্বিধাগ্রস্ত হওয়া" },
    { word: "Zeal", type: "Noun", meaning: "Great energy or enthusiasm in pursuit of a cause or an objective.", bangla: "প্রবল আগ্রহ" },
    { word: "Abstruse", type: "Adjective", meaning: "Difficult to understand; obscure.", bangla: "দুর্বোধ্য" },
    { word: "Belligerent", type: "Adjective", meaning: "Hostile and aggressive.", bangla: "যুদ্ধংদেহী" },
    { word: "Cantankerous", type: "Adjective", meaning: "Bad-tempered, argumentative, and uncooperative.", bangla: "ঝগড়াটে" },
    
    // --- SET 20 ---
    { word: "Deride", type: "Verb", meaning: "Express contempt for; ridicule.", bangla: "উপহাস করা" },
    { word: "Emulate", type: "Verb", meaning: "Match or surpass (a person or achievement), typically by imitation.", bangla: "অনুসরণ করা" },
    { word: "Fastidious", type: "Adjective", meaning: "Very attentive to and concerned about accuracy and detail.", bangla: "খুঁতখুঁতে" },
    { word: "Idiosyncrasy", type: "Noun", meaning: "A mode of behavior or way of thought peculiar to an individual.", bangla: "স্বকীয় বৈশিষ্ট্য" },
    { word: "Jovial", type: "Adjective", meaning: "Cheerful and friendly.", bangla: "প্রফুল্ল" },
    { word: "Knack", type: "Noun", meaning: "An acquired or natural skill at performing a task.", bangla: "দক্ষতা / কৌশল" },
    { word: "Lethargy", type: "Noun", meaning: "A lack of energy and enthusiasm.", bangla: "অলসতা" },
    { word: "Magnanimity", type: "Noun", meaning: "The condition of being magnanimous; generosity.", bangla: "মহানুভবতা" },
    { word: "Nefariousness", type: "Noun", meaning: "The quality of being wicked or criminal.", bangla: "দুষ্টামি" },
    { word: "Obviate", type: "Verb", meaning: "Remove (a need or difficulty).", bangla: "পরিহার করা / নিবারণ করা" },

    // --- SET 21 ---
    { word: "Palliate", type: "Verb", meaning: "Make (a disease or its symptoms) less severe or unpleasant without removing the cause.", bangla: "উপশম করা" },
    { word: "Recant", type: "Verb", meaning: "Say that one no longer holds an opinion or belief, especially one considered heretical.", bangla: "প্রত্যাহার করা" },
    { word: "Salubrious", type: "Adjective", meaning: "Health-giving; healthy.", bangla: "স্বাস্থ্যকর" },
    { word: "Tautology", type: "Noun", meaning: "The saying of the same thing twice in different words.", bangla: "দ্বিরুক্তি" },
    { word: "Ubiquitousness", type: "Noun", meaning: "The state of being everywhere at once (or seeming to be).", bangla: "সর্বব্যাপিতা" },
    { word: "Vacillation", type: "Noun", meaning: "The inability to decide between different opinions or actions; indecision.", bangla: "দোদুল্যমানতা" },
    { word: "Wanderer", type: "Noun", meaning: "A person who travels aimlessly; a traveler.", bangla: "পরিব্রাজক" },
    { word: "Yearning", type: "Noun", meaning: "A feeling of intense longing for something.", bangla: "তীব্র আকাঙ্ক্ষা" },
    { word: "Zealotry", type: "Noun", meaning: "Fanatical and uncompromising pursuit of religious, political, or other ideals.", bangla: "গোঁড়ামি" },
    { word: "Acrimony", type: "Noun", meaning: "Bitterness or ill feeling.", bangla: "তিক্ততা" },

    // --- SET 22 ---
    { word: "Boorish", type: "Adjective", meaning: "Rough and bad-mannered; coarse.", bangla: "অমার্জিত" },
    { word: "Cajole", type: "Verb", meaning: "Persuade (someone) to do something by sustained coaxing or flattery.", bangla: "তোষামোদ করে পটিয়ে ফেলা" },
    { word: "Deleterious", type: "Adjective", meaning: "Causing harm or damage.", bangla: "ক্ষতিকর" },
    { word: "Effervescent", type: "Adjective", meaning: "(of a liquid) giving off bubbles; fizzy. (of a person) vivacious and enthusiastic.", bangla: "বুদবুদপূর্ণ / প্রাণবন্ত" },
    { word: "Felicitous", type: "Adjective", meaning: "Well chosen or suited to the circumstances.", bangla: "যথাযথ / আনন্দদায়ক" },
    { word: "Germane", type: "Adjective", meaning: "Relevant to a subject under consideration.", bangla: "প্রাসঙ্গিক" },
    { word: "Harbinger", type: "Noun", meaning: "A person or thing that announces or signals the approach of another.", bangla: "অগ্রদূত" },
    { word: "Jubilant", type: "Adjective", meaning: "Feeling or expressing great happiness and triumph.", bangla: "উল্লাসিত" },
    { word: "Kudos", type: "Noun", meaning: "Praise and honor received for an achievement.", bangla: "প্রশংসা / সম্মান" },
    { word: "Lachrymose", type: "Adjective", meaning: "Tearful or given to weeping.", bangla: "কাঁদুনে" },

    // --- SET 23 ---
    { word: "Malevolent", type: "Adjective", meaning: "Having or showing a wish to do evil to others.", bangla: "হিংস্র / অমঙ্গলকামী" },
    { word: "Nebulous", type: "Adjective", meaning: "In the form of a cloud or haze; hazy.", bangla: "অস্পষ্ট / কুয়াশাচ্ছন্ন" },
    { word: "Obtuse", type: "Adjective", meaning: "Annoyingly insensitive or slow to understand.", bangla: "স্থূলবুদ্ধি" },
    { word: "Panacea", type: "Noun", meaning: "A solution or remedy for all difficulties or diseases.", bangla: "সর্বরোগের ঔষধ" },
    { word: "Quell", type: "Verb", meaning: "Put an end to (a rebellion or other disorder), typically by the use of force.", bangla: "দমন করা" },
    { word: "Sagacity", type: "Noun", meaning: "The quality of being sagacious.", bangla: "বিচক্ষণতা" },
    { word: "Taciturnity", type: "Noun", meaning: "The state or quality of being reserved or uncommunicative in speech.", bangla: "স্বল্পভাষিতা" },
    { word: "Vagary", type: "Noun", meaning: "An unexpected and inexplicable change in a situation or in someone's behavior.", bangla: "খামখেয়াল" },
    { word: "Wistfulness", type: "Noun", meaning: "A feeling of vague or regretful longing.", bangla: "বিষাদ" },
    { word: "Yieldingness", type: "Noun", meaning: "The quality of being yielding.", bangla: "নমনীয়তা" },

    // --- SET 24 ---
    { word: "Zealousness", type: "Noun", meaning: "Great energy or enthusiasm in pursuit of a cause or an objective.", bangla: "অত্যুৎসাহ" },
    { word: "Abrogate", type: "Verb", meaning: "Repeal or do away with (a law, right, or formal agreement).", bangla: "বাতিল করা" },
    { word: "Burnish", type: "Verb", meaning: "Polish (something, especially metal) by rubbing.", bangla: "ঘষে মেজে চকচকে করা" },
    { word: "Calumny", type: "Noun", meaning: "The making of false and defamatory statements about someone in order to damage their reputation; slander.", bangla: "কলঙ্কলেপন" },
    { word: "Demagogue", type: "Noun", meaning: "A political leader who seeks support by appealing to the desires and prejudices of ordinary people rather than by using rational argument.", bangla: "জননেতা (নেতিবাচক অর্থে)" },
    { word: "Effrontery", type: "Noun", meaning: "Insolent or impertinent behavior.", bangla: "ধৃষ্টতা" },
    { word: "Fastidiousness", type: "Noun", meaning: "Quality of being very attentive to and concerned about accuracy and detail.", bangla: "খুঁতখুঁতে স্বভাব" },
    { word: "Grandiloquent", type: "Adjective", meaning: "Pompous or extravagant in language, style, or manner, especially in a way that is intended to impress.", bangla: "বাগাড়ম্বরপূর্ণ" },
    { word: "Hegemony", type: "Noun", meaning: "Leadership or dominance, especially by one country or social group over others.", bangla: "আধিপত্য" },
    { word: "Iconoclastic", type: "Adjective", meaning: "Characterized by attack on cherished beliefs or institutions.", bangla: "প্রথা-বিরোধী" },

    // --- SET 25 ---
    { word: "Knell", type: "Noun", meaning: "The sound of a bell, especially when rung solemnly for a death or funeral.", bangla: "মৃত্যুঘণ্টা" },
    { word: "Languor", type: "Noun", meaning: "The state or feeling, often pleasant, of tiredness or inertia.", bangla: "অবসন্নতা" },
    { word: "Mendacious", type: "Adjective", meaning: "Not telling the truth; lying.", bangla: "মিথ্যাবাদী" },
    { word: "Noxious", type: "Adjective", meaning: "Harmful, poisonous, or very unpleasant.", bangla: "ক্ষতিকারক / বিষাক্ত" },
    { word: "Paragon", type: "Noun", meaning: "A person or thing regarded as a perfect example of a particular quality.", bangla: "নিখুঁত উদাহরণ" },
    { word: "Quiescence", type: "Noun", meaning: "Inactivity or dormancy.", bangla: "নিষ্ক্রিয়তা" },
    { word: "Rraucous", type: "Adjective", meaning: "Making or constituting a disturbingly harsh and loud noise.", bangla: "কর্কশ" },
    { word: "Umbrage", type: "Noun", meaning: "Offense or annoyance.", bangla: "ক্ষোভ" },
    { word: "Xenophobe", type: "Noun", meaning: "A person with a dislike of or prejudice against people from other countries.", bangla: "বিদেশীবিদ্বেষী ব্যক্তি" },
    { word: "Yoke", type: "Verb", meaning: "Put a yoke on (a pair of animals); couple or attach with or to a yoke.", bangla: "জোয়াল পরানো / যুক্ত করা" },
    { word: "Adroit", type: "Adjective", meaning: "Clever or skillful in using the hands or mind.", bangla: "দক্ষ / নিপুণ" },
    { word: "Breve", type: "Noun", meaning: "A written or printed mark (˘) indicating a short or unstressed vowel.", bangla: "হ্রস্বস্বর চিহ্ন" },
    { word: "Clemency", type: "Noun", meaning: "Mercy; lenience.", bangla: "ক্ষমা" },
    { word: "Desiccated", type: "Adjective", meaning: "Dried out.", bangla: "শুষ্ক" },
    { word: "Ephemeral", type: "Adjective", meaning: "Lasting for a very short time.", bangla: "ক্ষণস্থায়ী" },
    { word: "Furtive", type: "Adjective", meaning: "Attempting to avoid notice or attention, typically because of guilt or a belief that discovery would lead to trouble; secretive.", bangla: "গোপন" },
    { word: "Gambol", type: "Verb", meaning: "Run or jump about playfully.", bangla: "লাফঝাঁপ করা" },
    { word: "Histrionic", type: "Adjective", meaning: "Overly theatrical or melodramatic in character or style.", bangla: "নাটকীয়" },
    { word: "Impecunious", type: "Adjective", meaning: "Having little or no money.", bangla: "নিঃস্ব" },
    { word: "Jettison", type: "Verb", meaning: "Throw or drop (something) from an aircraft or ship.", bangla: "ফেলে দেওয়া" },
    { word: "Kiosk", type: "Noun", meaning: "A small open-fronted hut or cubicle from which newspapers, refreshments, tickets, etc., are sold.", bangla: "ছোট দোকান" },
    { word: "Levity", type: "Noun", meaning: "Humor or frivolity, especially the treatment of a serious matter with humor or in a manner lacking due respect.", bangla: "চপলতা" },
    { word: "Maelstrom", type: "Noun", meaning: "A powerful whirlpool in the sea or a river.", bangla: "ঘূর্ণিপাক" },
    { word: "Neophyte", type: "Noun", meaning: "A person who is new to a subject, skill, or belief.", bangla: "নবিশ" },
    { word: "Opulent", type: "Adjective", meaning: "Ostentatiously rich and luxurious or lavish.", bangla: "বিত্তশালী" },
    { word: "Paucity", type: "Noun", meaning: "The presence of something only in small or insufficient quantities or amounts; scarcity.", bangla: "স্বল্পতা" },
    { word: "Quagmire", type: "Noun", meaning: "A soft boggy area of land that gives way underfoot.", bangla: "জলাভূমি" },
    { word: "Relegate", type: "Verb", meaning: "Consign or dismiss to an inferior rank or position.", bangla: "অবনমন করা" },
    { word: "Surreptitious", type: "Adjective", meaning: "Kept secret, especially because it would not be approved of.", bangla: "গুপ্ত" },
    { word: "Truculent", type: "Adjective", meaning: "Eager or quick to argue or fight; aggressively defiant.", bangla: "রগচটা" },
    { word: "Usurp", type: "Verb", meaning: "Take (a position of power or importance) illegally or by force.", bangla: "জবরদখল করা" },
    { word: "Vacillate", type: "Verb", meaning: "Alternate or waver between different opinions or actions; be indecisive.", bangla: "দ্বিধাগ্রস্ত হওয়া" },
    { word: "Winsome", type: "Adjective", meaning: "Attractive or appealing in appearance or character.", bangla: "মনোহর" },
    { word: "Xenophobia", type: "Noun", meaning: "Dislike of or prejudice against people from other countries.", bangla: "বিদেশী ভীতি" },
    { word: "Yoke", type: "Noun", meaning: "A wooden crosspiece that is fastened over the necks of two animals and attached to the plow or cart that they are to pull.", bangla: "জোয়াল" },
    { word: "Zealot", type: "Noun", meaning: "A person who is fanatical and uncompromising in pursuit of their ideals.", bangla: "গোঁড়া" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Touch handling state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const filteredWords = words.filter(w => 
    w.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.bangla.includes(searchTerm)
  );

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [searchTerm]);

  const nextCard = () => {
    if (filteredWords.length === 0) return;
    setIsFlipped(false);
    
    if ((currentIndex + 1) % 3 === 0) {
        if(onTaskComplete) onTaskComplete();
    }

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
    }, 200);
  };
  
  const prevCard = () => {
    if (filteredWords.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
    }, 200);
  };

  const randomCard = () => {
     if (filteredWords.length === 0) return;
     setIsFlipped(false);
     const randomIndex = Math.floor(Math.random() * filteredWords.length);
     setTimeout(() => setCurrentIndex(randomIndex), 200);
  };

  // Swipe Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isSwipeLeft = distance > 50;
    const isSwipeRight = distance < -50;

    if (isSwipeLeft) {
      nextCard();
    } else if (isSwipeRight) {
      prevCard();
    }

    // Reset
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentWord = filteredWords[currentIndex];

  return (
    <div className="p-6 h-full flex flex-col select-none">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <div className="bg-orange-100 p-2 rounded-lg">
            <BookOpen className="text-orange-600" size={24} /> 
          </div>
          IELTS Vocab
        </h2>
        <div className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-bold border border-gray-200">
          {filteredWords.length > 0 ? `${currentIndex + 1} / ${filteredWords.length}` : '0'}
        </div>
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-10 py-4 border border-gray-200 rounded-2xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 ease-in-out sm:text-sm shadow-sm hover:bg-white"
          placeholder="Search word (e.g. Incentive)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <div className="flex justify-end mb-4">
         <button 
            onClick={randomCard}
            className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-2 rounded-lg hover:bg-orange-100 flex items-center gap-1"
         >
            <Shuffle size={14} /> Shuffle
         </button>
      </div>

      <div 
        className="flex-1 flex flex-col items-center justify-center w-full relative perspective-container max-w-sm mx-auto"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {filteredWords.length > 0 ? (
          <>
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full aspect-[3/4] perspective-1000 cursor-pointer group tap-highlight-transparent"
            >
              <div className={`relative w-full h-full duration-500 preserve-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* Front Side */}
                <div className="absolute w-full h-full backface-hidden bg-white border-2 border-orange-50 rounded-[2rem] shadow-xl flex flex-col items-center justify-center p-8 text-center hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                   <span className="text-orange-600 font-bold text-[10px] bg-orange-50 border border-orange-100 px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
                      Tap to reveal
                   </span>
                   <h3 className="text-4xl font-black text-gray-900 mb-3 break-words max-w-full leading-tight">{currentWord.word}</h3>
                   <p className="text-gray-400 italic font-medium text-lg">({currentWord.type})</p>
                   
                   <div className="absolute bottom-8 text-gray-300 flex items-center gap-2 text-xs font-medium animate-pulse">
                     <Hand size={14} /> Swipe to navigate
                   </div>
                </div>

                {/* Back Side */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2rem] shadow-xl flex flex-col items-center justify-center p-8 text-center text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                  
                  <h3 className="text-3xl font-bold mb-4 relative z-10">{currentWord.word}</h3>
                  <div className="w-16 h-1.5 bg-white/30 rounded-full mb-8 relative z-10"></div>
                  
                  <div className="mb-8 relative z-10">
                    <p className="text-[10px] uppercase opacity-80 mb-2 tracking-widest font-bold">Definition</p>
                    <p className="text-base leading-relaxed font-medium text-orange-50">
                      "{currentWord.meaning}"
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl w-full border border-white/20 relative z-10">
                    <p className="text-[10px] uppercase opacity-80 mb-1 tracking-widest font-bold">Bangla</p>
                    <p className="text-xl font-bold text-white">
                      {currentWord.bangla}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Navigation Buttons for Desktop / Accessibility */}
            {filteredWords.length > 1 && (
              <div className="flex gap-4 w-full mt-6">
                 <button 
                  onClick={prevCard}
                  className="flex-1 bg-white text-gray-900 border border-gray-200 px-4 py-4 rounded-2xl font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all"
                >
                  <ChevronLeft size={20} /> Prev
                </button>
                <button 
                  onClick={nextCard}
                  className="flex-1 bg-gray-900 text-white px-4 py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-black active:scale-95 transition-all"
                >
                  Next <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 mt-20">
            <div className="bg-gray-100 p-6 rounded-full inline-block mb-4">
              <Search size={40} className="text-gray-300" />
            </div>
            <p className="font-bold text-lg text-gray-700">No words found</p>
            <p className="text-sm mt-1 text-gray-400">Try searching for something else.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabScreen;