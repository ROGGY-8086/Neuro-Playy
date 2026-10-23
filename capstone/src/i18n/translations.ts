export type SupportedLanguage = 'EN' | 'MR' | 'HI';

export interface AuthTranslations {
  // Common / Choice
  welcomeTitle: string;
  welcomeSubtitle: string;
  patientCardTitle: string;
  patientCardDesc: string;
  patientCardLogin: string;
  patientCardSignup: string;
  caregiverCardTitle: string;
  caregiverCardDesc: string;
  caregiverCardLogin: string;
  caregiverCardSignup: string;
  alreadyLoggedInPatient: string;
  alreadyLoggedInCaregiver: string;
  backToChoice: string;
  soundLabel: string;
  soundOn: string;
  soundOff: string;
  processing: string;
  genericLoginError: string;
  passwordRequired: string;
  passwordMax: string;
  showPassword: string;
  hidePassword: string;
  switchToPatientLogin: string;
  switchToCaregiverLogin: string;

  // Caregiver Login & Signup
  caregiverLoginTitle: string;
  caregiverLoginSubtitle: string;
  caregiverSignupTitle: string;
  caregiverSignupSubtitle: string;
  caregiverFullNameLabel: string;
  caregiverFullNamePlaceholder: string;
  usernameLabel: string;
  usernamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  identifierLabel: string;
  identifierPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  whoWillUseLabel: string;
  whoWillUsePlaceholder: string;
  patientLanguageLabel: string;
  consentCheckboxLabel: string;
  consentRequiredError: string;
  caregiverSignupButton: string;
  caregiverLoginButton: string;
  noCaregiverAccountPrompt: string;
  haveCaregiverAccountPrompt: string;
  goToCaregiverSignup: string;
  goToCaregiverLogin: string;
  caregiverSignupSuccess: string;
  caregiverLoginSuccess: string;

  // Patient Login & Signup
  patientLoginTitle: string;
  patientLoginSubtitle: string;
  patientSignupTitle: string;
  patientSignupSubtitle: string;
  yourNameLabel: string;
  yourNamePlaceholder: string;
  yourNameRequired: string;
  optionalEmailLabel: string;
  optionalEmailPlaceholder: string;
  linkCodeLabel: string;
  linkCodePlaceholder: string;
  linkCodeHelper: string;
  linkCodeRequired: string;
  patientSignupButton: string;
  patientLoginButton: string;
  noPatientAccountPrompt: string;
  havePatientAccountPrompt: string;
  goToPatientSignup: string;
  goToPatientLogin: string;
  patientSignupSuccess: string;
  patientLoginSuccess: string;
  patientWelcomeBack: string;

  // Validation
  usernameRequired: string;
  emailRequired: string;
  emailInvalid: string;

  // Dashboard
  dashboardTitle: string;
  dashboardSubtitle: string;
  logoutButton: string;
  caregiverBadge: string;
  managedProfile: string;
  adaptiveRecommendation: string;
  recentSessions: string;
  activeReminders: string;
  memoriesCatalog: string;

  // Patient Login Management in Caregiver Dashboard
  patientAccountSection: string;
  patientAccountStatus: string;
  patientAccountActive: string;
  patientAccountPaused: string;
  patientAccountNone: string;
  setupPatientLoginBtn: string;
  linkCodeGeneratedTitle: string;
  linkCodeInstructions: string;
  resetPatientPasswordBtn: string;
  pausePatientLoginBtn: string;
  resumePatientLoginBtn: string;
  patientAccountCreatedNotice: string;
}

export const translations: Record<SupportedLanguage, AuthTranslations> = {
  EN: {
    welcomeTitle: 'Welcome to the Memory Platform',
    welcomeSubtitle: 'A calm, supportive space for joyful memory games, reminiscence, and gentle daily routines.',
    patientCardTitle: 'I am a Patient / Player',
    patientCardDesc: 'Play relaxing memory games, view My Life Story photos, and tend your peaceful virtual garden.',
    patientCardLogin: 'Log In to Play',
    patientCardSignup: 'Set up account with caregiver code',
    caregiverCardTitle: 'I am a Caregiver / Family Member',
    caregiverCardDesc: 'Manage player profiles, upload family memories, set gentle reminders, and review engagement history.',
    caregiverCardLogin: 'Caregiver Sign In',
    caregiverCardSignup: 'Create new caregiver account',
    alreadyLoggedInPatient: 'Continue playing games as',
    alreadyLoggedInCaregiver: 'Open caregiver management dashboard as',
    backToChoice: '← Choose another role',
    soundLabel: 'Audio feedback',
    soundOn: 'Sound: On',
    soundOff: 'Sound: Off',
    processing: 'Verifying securely...',
    genericLoginError: "The details you entered don't match. Please try again.",
    passwordRequired: 'Please enter a password',
    passwordMax: 'Password cannot exceed 128 characters',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    switchToPatientLogin: 'Looking to play games? Switch to Patient Login',
    switchToCaregiverLogin: 'Are you a caregiver? Switch to Caregiver Login',

    caregiverLoginTitle: 'Caregiver Portal Sign In',
    caregiverLoginSubtitle: 'Sign in to review engagement history, customize memories, and manage daily routines for your loved one.',
    caregiverSignupTitle: 'Create Caregiver Account',
    caregiverSignupSubtitle: 'Set up a calm, secure space to support memory engagement and coordinate daily care routines.',
    caregiverFullNameLabel: 'Caregiver Full Name',
    caregiverFullNamePlaceholder: 'e.g. Dr. Eleanor Vance',
    usernameLabel: 'Username',
    usernamePlaceholder: 'e.g. eleanor_care',
    emailLabel: 'Email Address',
    emailPlaceholder: 'e.g. eleanor@example.com',
    identifierLabel: 'Username or Email',
    identifierPlaceholder: 'Enter your username or email address',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password (up to 128 chars)',
    whoWillUseLabel: 'Who will be using this app? (Patient / Loved One Name)',
    whoWillUsePlaceholder: 'e.g. Margaret Vance',
    patientLanguageLabel: "Patient's Preferred Language",
    consentCheckboxLabel: 'I am authorized to set up this profile and assist this person.',
    consentRequiredError: 'Please confirm authorization to proceed.',
    caregiverSignupButton: 'Create Caregiver Account & Profile',
    caregiverLoginButton: 'Sign In as Caregiver',
    noCaregiverAccountPrompt: "Don't have a caregiver account?",
    haveCaregiverAccountPrompt: 'Already registered as a caregiver?',
    goToCaregiverSignup: 'Create a caregiver account',
    goToCaregiverLogin: 'Sign in here',
    caregiverSignupSuccess: 'Caregiver account and player profile created! Opening dashboard...',
    caregiverLoginSuccess: 'Welcome back! Opening your Caregiver Hub...',

    patientLoginTitle: 'Player Sign In',
    patientLoginSubtitle: 'Enter your username or email and password to start playing your games.',
    patientSignupTitle: 'Set Up Your Player Account',
    patientSignupSubtitle: 'Enter your name, choose a memorable username and password, and enter your caregiver link code.',
    yourNameLabel: 'Your Full Name',
    yourNamePlaceholder: 'e.g. Margaret Vance',
    yourNameRequired: 'Please enter your name',
    optionalEmailLabel: 'Email Address (Optional)',
    optionalEmailPlaceholder: 'Optional email address',
    linkCodeLabel: 'Caregiver Link Code',
    linkCodePlaceholder: '6-character code (e.g. K7M9P2)',
    linkCodeHelper: 'Ask your caregiver or family member for this 6-character code.',
    linkCodeRequired: 'Please enter the link code provided by your caregiver.',
    patientSignupButton: 'Create My Player Account',
    patientLoginButton: 'Log In to Play',
    noPatientAccountPrompt: 'Need to set up a player account?',
    havePatientAccountPrompt: 'Already have a player account?',
    goToPatientSignup: 'Sign up with caregiver link code',
    goToPatientLogin: 'Sign in here',
    patientSignupSuccess: 'Welcome! Your player account is ready. Taking you to your games...',
    patientLoginSuccess: 'Welcome back! Let us play your favorite games.',
    patientWelcomeBack: 'Welcome back,',

    usernameRequired: 'Please enter a username',
    emailRequired: 'Please enter an email address',
    emailInvalid: 'Please enter a valid email format (e.g. name@domain.com)',

    dashboardTitle: 'Caregiver Management Hub',
    dashboardSubtitle: 'Overview of cognitive engagement, memory reminiscence items, and supportive daily routines.',
    logoutButton: 'Sign Out',
    caregiverBadge: 'Authorized Caregiver',
    managedProfile: 'Managed Player Profile',
    adaptiveRecommendation: 'Supportive Difficulty Recommendation',
    recentSessions: 'Recent Engagement Sessions',
    activeReminders: 'Scheduled Daily Reminders',
    memoriesCatalog: 'Personalized Memory Items',

    patientAccountSection: 'Patient Login & Access',
    patientAccountStatus: 'Player Login Status',
    patientAccountActive: 'Active & Accessible',
    patientAccountPaused: 'Temporarily Paused',
    patientAccountNone: 'No Player Login Configured',
    setupPatientLoginBtn: 'Set Up Patient Login Code',
    linkCodeGeneratedTitle: 'New Patient Link Code Generated',
    linkCodeInstructions: 'Share this 6-character code with your loved one. They can enter it on /patient/signup to create their account. Valid for 24 hours.',
    resetPatientPasswordBtn: 'Reset Patient Password',
    pausePatientLoginBtn: 'Pause Player Login',
    resumePatientLoginBtn: 'Enable Player Login',
    patientAccountCreatedNotice: 'Patient can now log in at /patient/login using their own credentials.',
  },
  MR: {
    welcomeTitle: 'स्मृती सहकार्य प्लॅटफॉर्मवर आपले स्वागत आहे',
    welcomeSubtitle: 'आनंददायी स्मृती खेळ, आठवणी आणि शांत दैनंदिन दिनचर्यांसाठी एक सुरक्षित जागा.',
    patientCardTitle: 'मी खेळाडू / रुग्ण आहे',
    patientCardDesc: 'स्मृती खेळ खेळा, माझ्या जीवनाची गोष्ट पहा आणि शांत आभासी बागेची काळजी घ्या.',
    patientCardLogin: 'खेळण्यासाठी लॉगिन करा',
    patientCardSignup: 'काळजीवाहू कोड वापरून खाते तयार करा',
    caregiverCardTitle: 'मी काळजीवाहू / कुटुंब सदस्य आहे',
    caregiverCardDesc: 'प्रोफाइल व्यवस्थापित करा, कौटुंबिक आठवणी जोडा आणि दिनचर्या सांभाळा.',
    caregiverCardLogin: 'काळजीवाहू लॉगिन',
    caregiverCardSignup: 'नवीन काळजीवाहू खाते तयार करा',
    alreadyLoggedInPatient: 'खेळ सुरू ठेवा:',
    alreadyLoggedInCaregiver: 'काळजीवाहू डॅशबोर्ड उघडा:',
    backToChoice: '← भूमिका बदला',
    soundLabel: 'ध्वनी प्रतिसाद',
    soundOn: 'ध्वनी: चालू',
    soundOff: 'ध्वनी: बंद',
    processing: 'पडताळणी करत आहे...',
    genericLoginError: 'आपण प्रविष्ट केलेले तपशील जुळत नाहीत. कृपया पुन्हा प्रयत्न करा.',
    passwordRequired: 'कृपया पासवर्ड प्रविष्ट करा',
    passwordMax: 'पासवर्ड १२८ वर्णांपेक्षा जास्त असू शकत नाही',
    showPassword: 'पासवर्ड दाखवा',
    hidePassword: 'पासवर्ड लपवा',
    switchToPatientLogin: 'खेळ खेळायचे आहेत? खेळाडू लॉगिनवर जा',
    switchToCaregiverLogin: 'आपण काळजीवाहू आहात? काळजीवाहू लॉगिनवर जा',

    caregiverLoginTitle: 'काळजीवाहू पोर्टल लॉगिन',
    caregiverLoginSubtitle: 'आपल्या प्रिय व्यक्तीचा सहभाग इतिहास आणि दैनंदिन दिनचर्या व्यवस्थापित करण्यासाठी लॉगिन करा.',
    caregiverSignupTitle: 'नवीन काळजीवाहू खाते तयार करा',
    caregiverSignupSubtitle: 'स्मृती सहकार्य आणि दैनंदिन दिनचर्या सांभाळण्यासाठी एक सुरक्षित खाते सुरू करा.',
    caregiverFullNameLabel: 'काळजीवाहूचे पूर्ण नाव',
    caregiverFullNamePlaceholder: 'उदा. डॉ. अनिता जोशी',
    usernameLabel: 'वापरकर्ता नाव (Username)',
    usernamePlaceholder: 'उदा. anita_care',
    emailLabel: 'ईमेल पत्ता',
    emailPlaceholder: 'उदा. anita@example.com',
    identifierLabel: 'वापरकर्ता नाव किंवा ईमेल',
    identifierPlaceholder: 'वापरकर्ता नाव किंवा ईमेल प्रविष्ट करा',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'आपला पासवर्ड प्रविष्ट करा',
    whoWillUseLabel: 'हे ॲप कोण वापरणार? (प्रिय व्यक्तीचे नाव)',
    whoWillUsePlaceholder: 'उदा. सुमित्रा जोशी',
    patientLanguageLabel: 'पसंतीची भाषा',
    consentCheckboxLabel: 'मी या व्यक्तीसाठी प्रोफाइल सेट करण्यासाठी अधिकृत आहे.',
    consentRequiredError: 'कृपया पुढे जाण्यासाठी अधिकृततेची पुष्टी करा.',
    caregiverSignupButton: 'काळजीवाहू खाते आणि प्रोफाइल तयार करा',
    caregiverLoginButton: 'काळजीवाहू म्हणून साइन इन करा',
    noCaregiverAccountPrompt: 'काळजीवाहू खाते नाही का?',
    haveCaregiverAccountPrompt: 'आधीच नोंदणी केली आहे का?',
    goToCaregiverSignup: 'काळजीवाहू खाते तयार करा',
    goToCaregiverLogin: 'येथे लॉगिन करा',
    caregiverSignupSuccess: 'खाते तयार झाले! डॅशबोर्ड उघडत आहे...',
    caregiverLoginSuccess: 'स्वागत आहे! काळजीवाहू हब उघडत आहे...',

    patientLoginTitle: 'खेळाडू लॉगिन',
    patientLoginSubtitle: 'खेळ सुरू करण्यासाठी आपले वापरकर्ता नाव आणि पासवर्ड प्रविष्ट करा.',
    patientSignupTitle: 'नवीन खेळाडू खाते तयार करा',
    patientSignupSubtitle: 'आपले नाव, पासवर्ड आणि काळजीवाहूने दिलेला कोड प्रविष्ट करा.',
    yourNameLabel: 'आपले पूर्ण नाव',
    yourNamePlaceholder: 'उदा. सुमित्रा जोशी',
    yourNameRequired: 'कृपया आपले नाव प्रविष्ट करा',
    optionalEmailLabel: 'ईमेल पत्ता (ऐच्छिक)',
    optionalEmailPlaceholder: 'ऐच्छिक ईमेल',
    linkCodeLabel: 'काळजीवाहू लिंक कोड',
    linkCodePlaceholder: '६-अक्षरी कोड (उदा. K7M9P2)',
    linkCodeHelper: 'आपल्या काळजीवाहूकडून हा ६-अक्षरी कोड मिळवा.',
    linkCodeRequired: 'कृपया काळजीवाहूने दिलेला कोड प्रविष्ट करा.',
    patientSignupButton: 'माझे खाते तयार करा',
    patientLoginButton: 'खेळण्यासाठी लॉगिन करा',
    noPatientAccountPrompt: 'नवीन खाते सुरू करायचे आहे का?',
    havePatientAccountPrompt: 'आधीच खाते आहे का?',
    goToPatientSignup: 'लिंक कोड वापरून नोंदणी करा',
    goToPatientLogin: 'येथे लॉगिन करा',
    patientSignupSuccess: 'स्वागत आहे! आपले खाते तयार झाले आहे...',
    patientLoginSuccess: 'स्वागत आहे! आपले आवडते खेळ सुरू करूया.',
    patientWelcomeBack: 'पुन्हा स्वागत,',

    usernameRequired: 'कृपया वापरकर्ता नाव प्रविष्ट करा',
    emailRequired: 'कृपया ईमेल पत्ता प्रविष्ट करा',
    emailInvalid: 'कृपया वैध ईमेल प्रविष्ट करा',

    dashboardTitle: 'काळजीवाहू व्यवस्थापन केंद्र',
    dashboardSubtitle: 'सहभाग उपक्रम, आठवणी आणि दैनंदिन दिनचर्येचे विहंगावलोकन.',
    logoutButton: 'साइन आउट',
    caregiverBadge: 'अधिकृत काळजीवाहू',
    managedProfile: 'व्यवस्थापित खेळाडू प्रोफाइल',
    adaptiveRecommendation: 'अनुकूलित काठिण्य शिफारस',
    recentSessions: 'अलीकडील सहभाग सत्रे',
    activeReminders: 'दैनंदिन स्मरणपत्रे',
    memoriesCatalog: 'वैयक्तिकृत आठवणी',

    patientAccountSection: 'रुग्ण / खेळाडू प्रवेश व्यवस्थापन',
    patientAccountStatus: 'खेळाडू लॉगिन स्थिती',
    patientAccountActive: 'सक्रिय आणि उपलब्ध',
    patientAccountPaused: 'तात्पुरते थांबवले आहे',
    patientAccountNone: 'लॉगिन कॉन्फिगर केलेले नाही',
    setupPatientLoginBtn: 'खेळाडू लिंक कोड तयार करा',
    linkCodeGeneratedTitle: 'नवीन लिंक कोड तयार झाला',
    linkCodeInstructions: 'हा ६-अक्षरी कोड आपल्या प्रिय व्यक्तीला द्या. २४ तासांसाठी वैध.',
    resetPatientPasswordBtn: 'खेळाडू पासवर्ड रीसेट करा',
    pausePatientLoginBtn: 'लॉगिन थांबवा',
    resumePatientLoginBtn: 'लॉगिन सुरू करा',
    patientAccountCreatedNotice: 'खेळाडू आता /patient/login वर लॉगिन करू शकतात.',
  },
  HI: {
    welcomeTitle: 'मेमोरी प्लेटफॉर्म में आपका स्वागत है',
    welcomeSubtitle: 'आनंददायक स्मृति खेल, यादें और शांत दैनिक दिनचर्या के लिए एक सुरक्षित स्थान।',
    patientCardTitle: 'मैं खिलाड़ी / रोगी हूँ',
    patientCardDesc: 'शांत स्मृति खेल खेलें, मेरी जीवन यात्रा देखें और शांतिपूर्ण आभासी बगीचे की देखभाल करें।',
    patientCardLogin: 'खेलने के लिए लॉगिन करें',
    patientCardSignup: 'केयरगिवर कोड से खाता बनाएं',
    caregiverCardTitle: 'मैं केयरगिवर / परिवार का सदस्य हूँ',
    caregiverCardDesc: 'प्रोफ़ाइल प्रबंधित करें, पारिवारिक यादें जोड़ें, दैनिक दिनचर्या बनाएं और इतिहास देखें।',
    caregiverCardLogin: 'केयरगिवर साइन इन',
    caregiverCardSignup: 'नया केयरगिवर खाता बनाएं',
    alreadyLoggedInPatient: 'खेल जारी रखें:',
    alreadyLoggedInCaregiver: 'केयरगिवर हब खोलें:',
    backToChoice: '← भूमिका बदलें',
    soundLabel: 'ध्वनि प्रतिक्रिया',
    soundOn: 'ध्वनि: चालू',
    soundOff: 'ध्वनि: बंद',
    processing: 'सुरक्षित सत्यापन हो रहा है...',
    genericLoginError: 'आपके द्वारा दर्ज किए गए विवरण मेल नहीं खाते। कृपया पुनः प्रयास करें।',
    passwordRequired: 'कृपया पासवर्ड दर्ज करें',
    passwordMax: 'पासवर्ड 128 वर्णों से अधिक नहीं हो सकता',
    showPassword: 'पासवर्ड दिखाएं',
    hidePassword: 'पासवर्ड छिपाएं',
    switchToPatientLogin: 'खेल खेलना चाहते हैं? रोगी लॉगिन पर जाएं',
    switchToCaregiverLogin: 'क्या आप केयरगिवर हैं? केयरगिवर लॉगिन पर जाएं',

    caregiverLoginTitle: 'केयरगिवर पोर्टल लॉगिन',
    caregiverLoginSubtitle: 'गतिविधि इतिहास, यादें और दैनिक दिनचर्या प्रबंधित करने के लिए लॉगिन करें।',
    caregiverSignupTitle: 'नया केयरगिवर खाता बनाएं',
    caregiverSignupSubtitle: 'स्मृति सहभागिता और दैनिक दिनचर्या के लिए एक शांत और सुरक्षित खाता शुरू करें।',
    caregiverFullNameLabel: 'केयरगिवर का पूरा नाम',
    caregiverFullNamePlaceholder: 'उदा. डॉ. अनिता जोशी',
    usernameLabel: 'उपयोगकर्ता नाम (Username)',
    usernamePlaceholder: 'उदा. anita_care',
    emailLabel: 'ईमेल पता',
    emailPlaceholder: 'उदा. anita@example.com',
    identifierLabel: 'उपयोगकर्ता नाम या ईमेल',
    identifierPlaceholder: 'उपयोगकर्ता नाम या ईमेल दर्ज करें',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    whoWillUseLabel: 'इस ऐप का उपयोग कौन करेगा? (प्रियजन का नाम)',
    whoWillUsePlaceholder: 'उदा. सुमित्रा जोशी',
    patientLanguageLabel: 'पसंदीदा भाषा',
    consentCheckboxLabel: 'मैं इस व्यक्ति के लिए प्रोफ़ाइल स्थापित करने के लिए अधिकृत हूँ।',
    consentRequiredError: 'आगे बढ़ने के लिए कृपया प्राधिकरण की पुष्टि करें।',
    caregiverSignupButton: 'केयरगिवर खाता और प्रोफ़ाइल बनाएं',
    caregiverLoginButton: 'केयरगिवर के रूप में साइन इन करें',
    noCaregiverAccountPrompt: 'क्या केयरगिवर खाता नहीं है?',
    haveCaregiverAccountPrompt: 'क्या पहले से पंजीकृत हैं?',
    goToCaregiverSignup: 'केयरगिवर खाता बनाएं',
    goToCaregiverLogin: 'यहाँ लॉगिन करें',
    caregiverSignupSuccess: 'खाता सफलतापूर्वक बन गया! डैशबोर्ड खुल रहा है...',
    caregiverLoginSuccess: 'स्वागत है! केयरगिवर हब खुल रहा है...',

    patientLoginTitle: 'खिलाड़ी लॉगिन',
    patientLoginSubtitle: 'खेल शुरू करने के लिए अपना उपयोगकर्ता नाम और पासवर्ड दर्ज करें।',
    patientSignupTitle: 'नया खिलाड़ी खाता बनाएं',
    patientSignupSubtitle: 'अपना नाम, पासवर्ड और केयरगिवर लिंक कोड दर्ज करें।',
    yourNameLabel: 'आपका पूरा नाम',
    yourNamePlaceholder: 'उदा. सुमित्रा जोशी',
    yourNameRequired: 'कृपया अपना नाम दर्ज करें',
    optionalEmailLabel: 'ईमेल पता (वैकल्पिक)',
    optionalEmailPlaceholder: 'वैकल्पिक ईमेल पता',
    linkCodeLabel: 'केयरगिवर लिंक कोड',
    linkCodePlaceholder: '6-वर्ण कोड (उदा. K7M9P2)',
    linkCodeHelper: 'अपने केयरगिवर या परिवार के सदस्य से यह 6-अक्षरी कोड मांगें।',
    linkCodeRequired: 'कृपया केयरगिवर द्वारा प्रदान किया गया कोड दर्ज करें।',
    patientSignupButton: 'मेरा खिलाड़ी खाता बनाएं',
    patientLoginButton: 'खेलने के लिए लॉगिन करें',
    noPatientAccountPrompt: 'क्या नया खाता बनाना है?',
    havePatientAccountPrompt: 'क्या पहले से खाता है?',
    goToPatientSignup: 'लिंक कोड से साइन अप करें',
    goToPatientLogin: 'यहाँ लॉगिन करें',
    patientSignupSuccess: 'स्वागत है! आपका खाता तैयार है...',
    patientLoginSuccess: 'स्वागत है! आइए आपके पसंदीदा खेल खेलें।',
    patientWelcomeBack: 'पुनः स्वागत,',

    usernameRequired: 'कृपया उपयोगकर्ता नाम दर्ज करें',
    emailRequired: 'कृपया ईमेल पता दर्ज करें',
    emailInvalid: 'कृपया एक मान्य ईमेल दर्ज करें',

    dashboardTitle: 'केयरगिवर प्रबंधन केंद्र',
    dashboardSubtitle: 'संज्ञानात्मक सहभागिता, यादों और दैनिक दिनचर्या का विहंगावलोकन।',
    logoutButton: 'साइन आउट',
    caregiverBadge: 'अधिकृत केयरगिवर',
    managedProfile: 'प्रबंधित खिलाड़ी प्रोफ़ाइल',
    adaptiveRecommendation: 'अनुकूलनीय कठिनाई सिफारिश',
    recentSessions: 'हाल के गतिविधि सत्र',
    activeReminders: 'अनुसूचित दैनिक स्मरणपत्र',
    memoriesCatalog: 'व्यक्तिगत यादें',

    patientAccountSection: 'रोगी / खिलाड़ी लॉगिन प्रबंधन',
    patientAccountStatus: 'खिलाड़ी लॉगिन स्थिति',
    patientAccountActive: 'सक्रिय और सुलभ',
    patientAccountPaused: 'अस्थायी रूप से रोका गया',
    patientAccountNone: 'लॉगिन कॉन्फ़िगर नहीं किया गया',
    setupPatientLoginBtn: 'खिलाड़ी लिंक कोड बनाएं',
    linkCodeGeneratedTitle: 'नया लिंक कोड उत्पन्न हुआ',
    linkCodeInstructions: 'यह 6-वर्ण कोड अपने प्रियजन के साथ साझा करें। 24 घंटे के लिए मान्य।',
    resetPatientPasswordBtn: 'खिलाड़ी पासवर्ड रीसेट करें',
    pausePatientLoginBtn: 'लॉगिन रोकें',
    resumePatientLoginBtn: 'लॉगिन सक्षम करें',
    patientAccountCreatedNotice: 'खिलाड़ी अब /patient/login पर लॉगिन कर सकते हैं।',
  },
};
