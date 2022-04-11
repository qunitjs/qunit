/* global example */
QUnit.module('Cognitive biases', function () {
  QUnit.module('Anchoring bias', function () {
    QUnit.module('Common source bias', example);
    QUnit.module('Conservatism bias', example);
    QUnit.module('Functional fixedness', example);
    QUnit.module('Law of the instrument', example);
  });
  QUnit.module('Apophenia', function () {
    QUnit.module('Clustering illusion', example);
    QUnit.module('Illusory correlation', example);
    QUnit.module('Pareidolia', example);
  });
  QUnit.module('Availability heuristic', function () {
    QUnit.module('Anthropocentric thinking', example);
    QUnit.module('Anthropomorphism', example);
    QUnit.module('Attentional bias', example);
    QUnit.module('Frequency illusion', example);
    QUnit.module('Implicit association', example);
    QUnit.module('Salience bias', example);
    QUnit.module('Selection bias', example);
    QUnit.module('Survivorship bias', example);
    QUnit.module('Well travelled road effect', example);
  });
  QUnit.module('Cognitive dissonance', function () {
    QUnit.module('Normalcy bias', example);
    QUnit.module('Effort justification', example);
    QUnit.module('Ben Franklin effect', example);
  });
  QUnit.module('Confirmation bias', function () {
    QUnit.module('Backfire effect', example);
    QUnit.module('Congruence bias', example);
    QUnit.module("Experimenter's", example);
    QUnit.module('Observer-expectancy effect', example);
    QUnit.module('Selective perception', example);
    QUnit.module('Semmelweis reflex', example);
  });
  QUnit.module('Egocentric bias', function () {
    QUnit.module('Bias blind spot', example);
    QUnit.module('False consensus effect', example);
    QUnit.module('False uniqueness bias', example);
    QUnit.module('Forer effect', example);
    QUnit.module('Illusion of asymmetric insight', example);
    QUnit.module('Illusion of control', example);
    QUnit.module('Illusion of transparency', example);
    QUnit.module('Illusion of validity', example);
    QUnit.module('Illusory superiority', example);
    QUnit.module('Naïve cynicism', example);
    QUnit.module('Naïve realism', example);
    QUnit.module('Overconfidence effect', example);
    QUnit.module('Planning fallacy', example);
    QUnit.module('Restraint bias', example);
    QUnit.module('Trait ascription bias', example);
    QUnit.module('Third-person effect', example);
  });
  QUnit.module('Extension neglect', function () {
    QUnit.module('Base rate fallacy', example);
    QUnit.module('Compassion fade', example);
    QUnit.module('Conjunction fallacy', example);
    QUnit.module('Duration neglect', example);
    QUnit.module('Hyperbolic discounting', example);
    QUnit.module('Insensitivity to sample size', example);
    QUnit.module('Less-is-better effect', example);
    QUnit.module('Neglect of probability', example);
    QUnit.module('Scope neglect', example);
    QUnit.module('Zero-risk bias', example);
  });
  QUnit.module('Framing effect', function () {
    QUnit.module('Contrast effect', example);
    QUnit.module('Decoy effect', example);
    QUnit.module('Default effect', example);
    QUnit.module('Denomination effect', example);
    QUnit.module('Distinction bias', example);
  });
  QUnit.module('Logical fallacy', function () {
    QUnit.module("Berkson's paradox", example);
    QUnit.module('Escalation of commitment', example);
    QUnit.module("Gambler's fallacy", example);
    QUnit.module('Hot-hand fallacy', example);
    QUnit.module('Illicit transference', example);
    QUnit.module('Plan continuation bias', example);
    QUnit.module('Subadditivity effect', example);
    QUnit.module('Time-saving bias', example);
    QUnit.module('Zero-sum bias', example);
  });
  QUnit.module('Prospect theory', function () {
    QUnit.module('Ambiguity effect', example);
    QUnit.module('Disposition effect', example);
    QUnit.module('Dread aversion', example);
    QUnit.module('Endowment effect', example);
    QUnit.module('Loss aversion', example);
    QUnit.module('Pseudocertainty effect', example);
    QUnit.module('Status quo bias', example);
    QUnit.module('System justification', example);
  });
  QUnit.module('Self-assessment', function () {
    QUnit.module('Dunning–Kruger effect', example);
    QUnit.module('Hot-cold empathy gap', example);
    QUnit.module('Hard–easy effect', example);
    QUnit.module('Illusion of explanatory depth', example);
    QUnit.module('Objectivity illusion', example);
  });
  QUnit.module('Truthiness', function () {
    QUnit.module('Belief bias', example);
    QUnit.module('Illusory truth effect', example);
    QUnit.module('Rhyme as reason effect', example);
    QUnit.module('Subjective validation', example);
  });
  QUnit.module('Social', function () {
    QUnit.module('Association fallacy', function () {
      QUnit.module('Authority bias', example);
      QUnit.module('Cheerleader effect', example);
      QUnit.module('Halo effect', example);
    });
    QUnit.module('Attribution bias', function () {
      QUnit.module('Actor-observer bias', example);
      QUnit.module('Defensive attribution hypothesis', example);
      QUnit.module('Extrinsic incentives bias', example);
      QUnit.module('Fundamental attribution error', example);
      QUnit.module('Group attribution error', example);
      QUnit.module('Hostile attribution bias', example);
      QUnit.module('Intentionality bias', example);
      QUnit.module('Just-world hypothesis', example);
      QUnit.module('Moral luck', example);
      QUnit.module('Puritanical bias', example);
      QUnit.module('Self-serving bias', example);
      QUnit.module('Ultimate attribution error', example);
    });
  });
});
