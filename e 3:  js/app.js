/**
 * EDAMANASSERY SPINE HOSPITAL PRIVATE LIMITED
 * Patient Management & Clinical Assessment System
 * JavaScript Controller: js/app.js
 */

(function () {
  'use strict';

  // Hospital Configuration & Meta Data
  const HOSPITAL_CONFIG = {
    name: 'EDAMANASSERY SPINE HOSPITAL',
    legalName: 'EDAMANASSERY SPINE HOSPITAL PRIVATE LIMITED',
    tagline: 'AYURVEDA HOSPITAL • BACK TO LIFE',
    accreditation: 'An ISO 9001 : 2015 Certified Hospital',
    ayushRegNo: 'CMBEAYU20220031614',
    formNumber: 'Form No: ESH/CS/F-1',
    address: '129/1, Narasimhanaicken Palayam, Mettupalayam Main Road, Coimbatore - 641 031',
    contactPhones: '90870 15557, 90870 15558, 90870 15559',
    email: 'Eshayurveda@gmail.com',
    website: 'www.e-spinehospital.com',
    logoPath: './assets/logo.jpg'
  };

  // LocalStorage Keys
  const STORAGE_KEYS = {
    PATIENTS: 'ESH_PATIENTS_DB_V2',
    ASSESSMENTS: 'ESH_ASSESSMENTS_DB_V2',
    ACTIVE_PATIENT: 'ESH_ACTIVE_PATIENT_REG_V2',
    SEQ_COUNTER: 'ESH_REG_SEQ_COUNTER_V2'
  };

  // Application State
  const state = {
    patients: [],
    assessments: [],
    activePatientReg: null,
    currentView: 'registration',
    cameraStream: null,
    uploadedPhotoDataUrl: null,
    selectedPainScore: 0,
    searchFilterText: '',
    searchTypeFilter: 'ALL'
  };

  // Seed Patients from physical hospital records
  const SEED_PATIENTS = [
    {
      regNo: 'ESHPA26090901',
      name: 'MRS. SUMATHI RAJKUMAR',
      dob: '1973-04-12',
      age: 53,
      gender: 'Female',
      maritalStatus: 'Married',
      bloodGroup: 'B+',
      occupation: 'Homemaker',
      regDate: '2026-09-26',
      address: '11, P.R.S Illam, Lakshmipuram, Kanthimade, Coimbatore - 641031',
      contact: '8489346023',
      altContact: '8826924944',
      email: 'sumathi.rajkumar@gmail.com',
      reference: 'Dr. R. Rajesh - 9842100012',
      referralSource: 'Relatives / Friends',
      otherFamily: 'None seen previously',
      billResponsible: 'Rajkumar (Husband) - 8826924944',
      careType: 'OP',
      fee: 250,
      paymentMode: 'Cash',
      photoUrl: ''
    },
    {
      regNo: 'ESHPA26080746',
      name: 'PARVEEN BALA SAINI',
      dob: '1956-08-10',
      age: 70,
      gender: 'Female',
      maritalStatus: 'Married',
      bloodGroup: 'O+',
      occupation: 'Homemaker',
      regDate: '2026-08-20',
      address: 'Narasimhanaicken Palayam, Coimbatore - 641031',
      contact: '9842215557',
      altContact: '',
      email: 'parveen.saini@gmail.com',
      reference: 'Walk-in directly',
      referralSource: 'Direct Walk in',
      otherFamily: '',
      billResponsible: 'Self',
      careType: 'OP',
      fee: 250,
      paymentMode: 'UPI / GPay',
      photoUrl: ''
    }
  ];

  // Seed Assessment matching Form No: ESH/CS/F-1
  const SEED_ASSESSMENTS = [
    {
      id: 'ASM_26090901_01',
      regNo: 'ESHPA26090901',
      assessmentDate: '2026-09-26',
      assessmentTime: '17:16',
      roomNo: 'OPD-02',
      dateOfAdmission: '',
      dateOfDischarge: '',
      physician: 'Dr. Sandra M George',
      vitals: {
        bpSystolic: 130,
        bpDiastolic: 80,
        pulse: 67,
        temp: 98.4,
        tempUnit: '°F',
        height: 165,
        weight: 92.5,
        bmi: 33.98,
        bmiCategory: 'Obese (Class I)',
        spo2: 98,
        respRate: 18
      },
      pain: {
        score: 8,
        descriptionLevel: 'Hurts Whole Lot',
        location: 'Cervical Spine (Neck) & Lumbar Spine (Low Back) radiating to bilateral legs',
        duration: '5 years (more aggravated since 3 months)',
        description: 'Severe burning sensation in both heels, numbness in bilateral lower limbs, sharp shooting radiculopathy.'
      },
      nutritional: {
        built: 'Overweight',
        unintentionalWeightLoss: 'No',
        decreaseFoodIntake: 'No',
        supplements: 'Yes',
        suggestedAssessment: 'No',
        status: 'Abnormal',
        dietaryAdvice: 'Calorie-restricted, anti-inflammatory spine rehabilitation diet. Vata-pacifying warm diet, avoid cold/sour foods, increase calcium & fiber.'
      },
      mental: {
        sheetAttached: 'Not applicable',
        status: 'Conscious, Alert & Oriented',
        psychological: 'Mild situational anxiety related to chronic back & neck pain. Cooperative and motivated for conservative spine care.',
        notes: 'Sleep mildly disturbed due to nocturnal paresthesia.'
      },
      antenatal: {
        sheetAttached: 'Not applicable',
        notes: 'Not applicable. Post-menopausal female.'
      },
      presentingComplaints: [
        { complaint: 'Neck pain since 5 years', duration: 'More aggravated since 3 months' }
      ],
      associatedComplaints: [
        { complaint: 'Low back pain since 5 years more aggravated since 3 months, radiating to both legs', duration: '5 years' },
        { complaint: 'Numbness in both legs & burning sensation of both heels', duration: '1 year' }
      ],
      doctorNotes: {
        clinicalFindings: 'Spine inspection: Mild loss of normal lumbar lordosis. Tenderness elicited over C5-C6 cervical spine and L4-L5, L5-S1 lumbar spinous processes. Bilateral paraspinal muscle spasm noted. Straight Leg Raise (SLR) positive bilaterally at 45 degrees. Sensation diminished along L5-S1 dermatome. Deep tendon reflexes present.',
        diagnosis: '1. Lumbar Spondylosis with L4-L5, L5-S1 Disc Bulge & Bilateral Sciatic Radiculopathy.\n2. Cervical Spondylosis with Muscle Spasm.',
        treatment: 'Comprehensive Conservative Ayurvedic Spine Protocol:\n1. Kati Vasti with Sahacharadi Mezhukupakam & Dhanwantharam Tailam for 7 days.\n2. Patra Pinda Swedana (Elakizhi) for 7 days.\n3. Greeva Vasti with Ksheerabala 101.\n4. Internal Meds:\n   - Tab. Shallaki 1 tab twice daily after food.\n   - Maharasnadi Kashayam 15ml + 45ml warm water twice daily before food.\n   - Ksheerabala 101 capsules 1-0-1.\n5. Lumbo-sacral corset belt while standing/travelling.\n6. Gentle spine traction and rehabilitation therapy.',
        followUp: '2026-10-10'
      },
      createdAt: '2026-09-26T17:16:00'
    }
  ];

  /* --------------------------------------------------------------------------
     INITIALIZATION & LOCALSTORAGE MANAGEMENT
     -------------------------------------------------------------------------- */
  function initApp() {
    loadDatabase();
    setupNavigation();
    setupRegistrationForm();
    setupCheckupForm();
    setupPatientDirectory();
    setupPainScale();
    setupCameraModal();
    setupLiveClock();
    renderActivePatientIndicator();

    // Default to sumathi rajkumar or first patient
    if (!state.activePatientReg && state.patients.length > 0) {
      setActivePatient(state.patients[0].regNo);
    }

    // Set today's date on registration form
    const dateInput = document.getElementById('regDate');
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }
  }

  function loadDatabase() {
    try {
      const storedPatients = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      if (storedPatients) {
        state.patients = JSON.parse(storedPatients);
      } else {
        state.patients = SEED_PATIENTS;
        savePatients();
      }

      const storedAssessments = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      if (storedAssessments) {
        state.assessments = JSON.parse(storedAssessments);
      } else {
        state.assessments = SEED_ASSESSMENTS;
        saveAssessments();
      }

      const activeReg = localStorage.getItem(STORAGE_KEYS.ACTIVE_PATIENT);
      if (activeReg) {
        state.activePatientReg = activeReg;
      }
    } catch (e) {
      console.error('Error loading data from localStorage:', e);
      state.patients = SEED_PATIENTS;
      state.assessments = SEED_ASSESSMENTS;
    }
  }

  function savePatients() {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(state.patients));
    } catch (e) {
      console.error('Error saving patients:', e);
      showToast('Storage quota exceeded.', 'error');
    }
  }

  function saveAssessments() {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(state.assessments));
    } catch (e) {
      console.error('Error saving assessments:', e);
      showToast('Storage quota exceeded.', 'error');
    }
  }

  function setActivePatient(regNo) {
    state.activePatientReg = regNo;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PATIENT, regNo);
    renderActivePatientIndicator();

    if (state.currentView === 'checkup') {
      loadPatientIntoCheckup(regNo);
    }
    if (state.currentView === 'history') {
      renderPatientHistory(regNo);
    }
  }

  function getActivePatient() {
    if (!state.activePatientReg) return null;
    return state.patients.find(p => p.regNo === state.activePatientReg) || null;
  }

  function generateUniqueRegNo() {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const prefix = `ESHPA${yy}${mm}`;

    let counter = 1;
    const storedSeq = localStorage.getItem(STORAGE_KEYS.SEQ_COUNTER);
    if (storedSeq) {
      counter = parseInt(storedSeq, 10) + 1;
    } else {
      state.patients.forEach(p => {
        if (p.regNo && p.regNo.startsWith(prefix)) {
          const numPart = parseInt(p.regNo.substring(prefix.length), 10);
          if (!isNaN(numPart) && numPart >= counter) {
            counter = numPart + 1;
          }
        }
      });
    }

    localStorage.setItem(STORAGE_KEYS.SEQ_COUNTER, String(counter));
    const serial = String(counter).padStart(4, '0');
    return `${prefix}${serial}`;
  }

  /* --------------------------------------------------------------------------
     NAVIGATION SYSTEM
     -------------------------------------------------------------------------- */
  function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-view]');
    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const viewId = this.getAttribute('data-view');
        switchView(viewId);
      });
    });

    const brandLink = document.querySelector('.hospital-branding');
    if (brandLink) {
      brandLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('registration');
      });
    }

    const pill = document.getElementById('activePatientPill');
    if (pill) {
      pill.addEventListener('click', () => {
        openPatientSelectorModal();
      });
    }

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (['registration', 'patients', 'checkup', 'history'].includes(hash)) {
        switchView(hash, false);
      }
    });

    if (window.location.hash) {
      const initialHash = window.location.hash.replace('#', '');
      if (['registration', 'patients', 'checkup', 'history'].includes(initialHash)) {
        switchView(initialHash, false);
      }
    }
  }

  function switchView(viewId, updateHash = true) {
    state.currentView = viewId;
    if (updateHash && window.location.hash !== `#${viewId}`) {
      window.location.hash = viewId;
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-view') === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    document.querySelectorAll('.app-view').forEach(view => {
      if (view.id === `view-${viewId}`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewId === 'patients') {
      renderPatientsTable();
    } else if (viewId === 'checkup') {
      if (state.activePatientReg) {
        loadPatientIntoCheckup(state.activePatientReg);
      } else if (state.patients.length > 0) {
        setActivePatient(state.patients[0].regNo);
      }
    } else if (viewId === 'history') {
      renderPatientHistory(state.activePatientReg);
    }
  }

  function renderActivePatientIndicator() {
    const activePill = document.getElementById('activePatientPill');
    const activeName = document.getElementById('activePatientName');
    const activePatient = getActivePatient();

    if (activePatient) {
      if (activeName) {
        activeName.textContent = `${activePatient.regNo} - ${activePatient.name}`;
      }
      if (activePill) activePill.style.display = 'flex';
    } else {
      if (activePill) activePill.style.display = 'none';
    }
  }

  function setupLiveClock() {
    const clockEl = document.getElementById('liveClock');
    function updateClock() {
      if (!clockEl) return;
      const now = new Date();
      const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      clockEl.textContent = now.toLocaleDateString('en-IN', options);
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  /* --------------------------------------------------------------------------
     1. REGISTRATION FORM CONTROLLER
     -------------------------------------------------------------------------- */
  function setupRegistrationForm() {
    const form = document.getElementById('patientRegistrationForm');
    const dobInput = document.getElementById('dob');
    const ageInput = document.getElementById('age');
    const photoFileInput = document.getElementById('photoFileInput');
    const btnClear = document.getElementById('btnClearForm');

    // DOB & Age auto calculation
    if (dobInput && ageInput) {
      dobInput.addEventListener('change', () => {
        if (dobInput.value) {
          const dob = new Date(dobInput.value);
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
          }
          if (age >= 0 && age <= 125) {
            ageInput.value = age;
          }
        }
      });

      ageInput.addEventListener('input', () => {
        const val = parseInt(ageInput.value, 10);
        if (!isNaN(val) && val >= 0 && val <= 120 && !dobInput.value) {
          const currentYear = new Date().getFullYear();
          const estYear = currentYear - val;
          dobInput.value = `${estYear}-01-01`;
        }
      });
    }

    // Patient Photo file upload handler
    if (photoFileInput) {
      photoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          compressAndPreviewImage(file, 300, 360, (dataUrl) => {
            state.uploadedPhotoDataUrl = dataUrl;
            renderPhotoPreview(dataUrl);
            showToast('Patient photo attached successfully.', 'success');
          });
        }
      });
    }

    const btnRemovePhoto = document.getElementById('btnRemovePhoto');
    if (btnRemovePhoto) {
      btnRemovePhoto.addEventListener('click', () => {
        state.uploadedPhotoDataUrl = null;
        renderPhotoPreview(null);
        if (photoFileInput) photoFileInput.value = '';
      });
    }

    // Care Type Radio Selection
    const careOptions = document.querySelectorAll('.fee-card-option');
    careOptions.forEach(opt => {
      opt.addEventListener('click', function () {
        careOptions.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        const radio = this.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        handlePatientRegistrationSubmit();
      });
    }

    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all form fields?')) {
          form.reset();
          state.uploadedPhotoDataUrl = null;
          renderPhotoPreview(null);
          const defaultCare = document.querySelector('.fee-card-option[data-type="OP"]');
          if (defaultCare) defaultCare.click();
          showToast('Form cleared.', 'info');
        }
      });
    }
  }

  function renderPhotoPreview(dataUrl) {
    const previewContainer = document.getElementById('patientPhotoPreview');
    if (!previewContainer) return;

    if (dataUrl) {
      previewContainer.innerHTML = `<img src="${dataUrl}" alt="Patient Photo" />`;
    } else {
      previewContainer.innerHTML = `
        <div class="photo-placeholder-icon">👤</div>
        <div class="photo-placeholder-text">No Photo</div>
      `;
    }
  }

  function handlePatientRegistrationSubmit() {
    const nameInput = document.getElementById('patientName');
    const dobInput = document.getElementById('dob');
    const ageInput = document.getElementById('age');
    const genderInput = document.querySelector('input[name="gender"]:checked');
    const maritalStatus = document.getElementById('maritalStatus');
    const bloodGroup = document.getElementById('bloodGroup');
    const occupation = document.getElementById('occupation');
    const regDateInput = document.getElementById('regDate');

    const address = document.getElementById('patientAddress');
    const contact = document.getElementById('contactNo');
    const altContact = document.getElementById('altContactNo');
    const email = document.getElementById('email');

    const reference = document.getElementById('referenceName');
    const referralSource = document.querySelector('input[name="referralSource"]:checked');

    const otherFamily = document.getElementById('otherFamilyMembers');
    const billResponsible = document.getElementById('billResponsiblePerson');

    const careTypeRadio = document.querySelector('input[name="careType"]:checked');
    const careType = careTypeRadio ? careTypeRadio.value : 'OP';
    const paymentMode = document.getElementById('paymentMode')?.value || 'Cash';

    // Validation
    if (!nameInput || !nameInput.value.trim()) {
      showToast('Please enter the Patient Name.', 'error');
      nameInput?.focus();
      return;
    }

    if (!ageInput || !ageInput.value || parseInt(ageInput.value, 10) < 0) {
      showToast('Please enter a valid Patient Age.', 'error');
      ageInput?.focus();
      return;
    }

    if (!genderInput) {
      showToast('Please select Sex / Gender.', 'error');
      return;
    }

    if (!contact || !contact.value.trim() || contact.value.trim().length < 10) {
      showToast('Please enter a valid 10-digit Contact Number.', 'error');
      contact?.focus();
      return;
    }

    const regNo = generateUniqueRegNo();
    const patientData = {
      regNo: regNo,
      name: nameInput.value.trim().toUpperCase(),
      dob: dobInput.value || '',
      age: parseInt(ageInput.value, 10),
      gender: genderInput.value,
      maritalStatus: maritalStatus ? maritalStatus.value : 'Single',
      bloodGroup: bloodGroup ? bloodGroup.value : 'Not Known',
      occupation: occupation ? occupation.value.trim() : 'Not Specified',
      regDate: regDateInput.value || new Date().toISOString().split('T')[0],
      address: address ? address.value.trim() : '',
      contact: contact.value.trim(),
      altContact: altContact ? altContact.value.trim() : '',
      email: email ? email.value.trim() : '',
      reference: reference ? reference.value.trim() : '',
      referralSource: referralSource ? referralSource.value : 'Direct Walk in',
      otherFamily: otherFamily ? otherFamily.value.trim() : '',
      billResponsible: billResponsible ? billResponsible.value.trim() : 'Self',
      careType: careType,
      fee: 250,
      paymentMode: paymentMode,
      photoUrl: state.uploadedPhotoDataUrl || ''
    };

    state.patients.unshift(patientData);
    savePatients();
    setActivePatient(regNo);

    showToast(`Patient Registered Successfully! Reg No: ${regNo}`, 'success');
    openRegistrationCardModal(patientData);
  }

  /* --------------------------------------------------------------------------
     2. PATIENT REGISTRATION CARD MODAL & RENDERER
     -------------------------------------------------------------------------- */
  function openRegistrationCardModal(patient) {
    const modal = document.getElementById('patientCardModal');
    if (!modal) return;

    document.getElementById('cardHospitalLogo').src = HOSPITAL_CONFIG.logoPath;
    document.getElementById('cardRegNo').textContent = patient.regNo;
    document.getElementById('cardPatientName').textContent = patient.name;
    document.getElementById('cardAge').textContent = patient.age;
    document.getElementById('cardGender').textContent = patient.gender;
    document.getElementById('cardBloodGroup').textContent = patient.bloodGroup || '-';
    document.getElementById('cardMaritalStatus').textContent = patient.maritalStatus || '-';
    document.getElementById('cardOccupation').textContent = patient.occupation || '-';
    document.getElementById('cardContact').textContent = patient.contact;
    document.getElementById('cardAddress').textContent = patient.address || 'Coimbatore';
    document.getElementById('cardRegDate').textContent = patient.regDate || '';

    const photoContainer = document.getElementById('cardPatientPhoto');
    if (photoContainer) {
      if (patient.photoUrl) {
        photoContainer.innerHTML = `<img src="${patient.photoUrl}" alt="${patient.name}" />`;
      } else {
        photoContainer.innerHTML = generateAvatarSvg(patient.name);
      }
    }

    const barcodeContainer = document.getElementById('cardBarcodeSvg');
    if (barcodeContainer) {
      barcodeContainer.innerHTML = generateBarcodeSvg(patient.regNo);
    }
    const barcodeText = document.getElementById('cardBarcodeText');
    if (barcodeText) {
      barcodeText.textContent = `*${patient.regNo}*`;
    }

    const btnOpenCheckup = document.getElementById('btnCardOpenCheckup');
    if (btnOpenCheckup) {
      btnOpenCheckup.onclick = () => {
        closeModal('patientCardModal');
        setActivePatient(patient.regNo);
        switchView('checkup');
      };
    }

    const btnPrintCard = document.getElementById('btnCardPrint');
    if (btnPrintCard) {
      btnPrintCard.onclick = () => {
        printRegistrationCard(patient);
      };
    }

    modal.classList.add('active');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close-btn')) {
      const activeModal = e.target.closest('.modal-overlay');
      if (activeModal) activeModal.classList.remove('active');
      if (state.cameraStream) {
        stopCamera();
      }
    }
  });

  /* --------------------------------------------------------------------------
     3. CHECK-UP SCREEN (OP/IP INITIAL ASSESSMENT - Form ESH/CS/F-1)
     -------------------------------------------------------------------------- */
  function setupCheckupForm() {
    const heightInput = document.getElementById('vitalHeight');
    const weightInput = document.getElementById('vitalWeight');
    const btnSaveCheckup = document.getElementById('btnSaveCheckup');
    const btnPrintCheckup = document.getElementById('btnPrintCheckup');
    const btnResetCheckup = document.getElementById('btnResetCheckup');
    const btnAddPresentingComplaint = document.getElementById('btnAddPresentingComplaint');
    const btnAddAssociatedComplaint = document.getElementById('btnAddAssociatedComplaint');
    const btnChangePatient = document.getElementById('btnCheckupChangePatient');

    if (heightInput && weightInput) {
      const updateBMI = () => {
        const h = parseFloat(heightInput.value);
        const w = parseFloat(weightInput.value);
        const bmiValEl = document.getElementById('calculatedBmiVal');
        const bmiBadgeEl = document.getElementById('bmiClassificationBadge');

        if (!isNaN(h) && !isNaN(w) && h > 40 && w > 10) {
          const hm = h / 100;
          const bmi = (w / (hm * hm)).toFixed(2);
          if (bmiValEl) bmiValEl.textContent = bmi;

          let category = 'Normal';
          let catClass = 'normal';
          if (bmi < 18.5) {
            category = 'Underweight';
            catClass = 'underweight';
          } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Normal Weight';
            catClass = 'normal';
          } else if (bmi >= 25 && bmi < 30) {
            category = 'Overweight';
            catClass = 'overweight';
          } else {
            category = 'Obese';
            catClass = 'obese';
          }

          if (bmiBadgeEl) {
            bmiBadgeEl.textContent = category;
            bmiBadgeEl.className = `bmi-badge ${catClass}`;
            bmiBadgeEl.style.display = 'inline-block';
          }
        } else {
          if (bmiValEl) bmiValEl.textContent = '--';
          if (bmiBadgeEl) bmiBadgeEl.style.display = 'none';
        }
      };

      heightInput.addEventListener('input', updateBMI);
      weightInput.addEventListener('input', updateBMI);
    }

    if (btnAddPresentingComplaint) {
      btnAddPresentingComplaint.addEventListener('click', () => {
        addComplaintRow('presentingComplaintsList', '', '');
      });
    }

    if (btnAddAssociatedComplaint) {
      btnAddAssociatedComplaint.addEventListener('click', () => {
        addComplaintRow('associatedComplaintsList', '', '');
      });
    }

    if (btnChangePatient) {
      btnChangePatient.addEventListener('click', () => {
        openPatientSelectorModal();
      });
    }

    if (btnSaveCheckup) {
      btnSaveCheckup.addEventListener('click', (e) => {
        e.preventDefault();
        handleSaveCheckup();
      });
    }

    if (btnPrintCheckup) {
      btnPrintCheckup.addEventListener('click', () => {
        printCheckupChart();
      });
    }

    if (btnResetCheckup) {
      btnResetCheckup.addEventListener('click', () => {
        if (confirm('Clear current check-up input fields?')) {
          resetCheckupForm();
          showToast('Check-up fields reset.', 'info');
        }
      });
    }
  }

  function addComplaintRow(containerId, complaintText = '', durationText = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'complaint-row-item';
    row.innerHTML = `
      <input type="text" class="input-control complaint-input" placeholder="e.g. Neck pain radiating to left shoulder" value="${escapeHtml(complaintText)}" />
      <input type="text" class="input-control duration-input" placeholder="e.g. 5 years / 3 months" value="${escapeHtml(durationText)}" />
      <button type="button" class="btn-remove-row" title="Remove Complaint">&times;</button>
    `;

    row.querySelector('.btn-remove-row').addEventListener('click', () => {
      row.remove();
    });

    container.appendChild(row);
  }

  function loadPatientIntoCheckup(regNo) {
    const patient = state.patients.find(p => p.regNo === regNo);
    if (!patient) return;

    document.getElementById('cuBannerName').textContent = patient.name;
    document.getElementById('cuBannerReg').textContent = patient.regNo;
    document.getElementById('cuBannerMeta').textContent = `Age: ${patient.age} | Sex: ${patient.gender} | Blood: ${patient.bloodGroup || '-'} | Phone: ${patient.contact}`;

    const bannerPhoto = document.getElementById('cuBannerPhoto');
    if (bannerPhoto) {
      bannerPhoto.src = patient.photoUrl || HOSPITAL_CONFIG.logoPath;
    }

    document.getElementById('cuPatientName').value = patient.name;
    document.getElementById('cuRegNo').value = patient.regNo;
    document.getElementById('cuAge').value = patient.age;
    document.getElementById('cuSex').value = patient.gender;
    document.getElementById('cuDob').value = patient.dob || '';
    document.getElementById('cuOccupation').value = patient.occupation || '';

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const cuTime = document.getElementById('cuAssessmentTime');
    if (cuTime) cuTime.value = timeStr;

    const cuDate = document.getElementById('cuAssessmentDate');
    if (cuDate) cuDate.value = now.toISOString().split('T')[0];

    const existing = state.assessments.find(a => a.regNo === regNo);
    if (existing) {
      populateAssessmentData(existing);
    } else {
      resetCheckupForm();
      ensureComplaintRows();
    }
  }

  function populateAssessmentData(asm) {
    if (asm.physician) document.getElementById('cuPhysician').value = asm.physician;
    if (asm.roomNo) document.getElementById('cuRoomNo').value = asm.roomNo;
    if (asm.dateOfAdmission) document.getElementById('cuDateOfAdmission').value = asm.dateOfAdmission;
    if (asm.dateOfDischarge) document.getElementById('cuDateOfDischarge').value = asm.dateOfDischarge;

    if (asm.vitals) {
      document.getElementById('vitalBpSystolic').value = asm.vitals.bpSystolic || '';
      document.getElementById('vitalBpDiastolic').value = asm.vitals.bpDiastolic || '';
      document.getElementById('vitalPulse').value = asm.vitals.pulse || '';
      document.getElementById('vitalTemp').value = asm.vitals.temp || '';
      document.getElementById('vitalHeight').value = asm.vitals.height || '';
      document.getElementById('vitalWeight').value = asm.vitals.weight || '';
      document.getElementById('vitalSpo2').value = asm.vitals.spo2 || '';
      document.getElementById('vitalRespRate').value = asm.vitals.respRate || '';
      document.getElementById('vitalHeight').dispatchEvent(new Event('input'));
    }

    if (asm.pain) {
      selectPainScore(asm.pain.score);
      if (asm.pain.location) document.getElementById('painLocation').value = asm.pain.location;
      if (asm.pain.duration) document.getElementById('painDuration').value = asm.pain.duration;
      if (asm.pain.description) document.getElementById('painDescription').value = asm.pain.description;
    }

    if (asm.nutritional) {
      setRadioVal('nutriBuilt', asm.nutritional.built);
      setRadioVal('nutriWeightLoss', asm.nutritional.unintentionalWeightLoss);
      setRadioVal('nutriDecreaseFood', asm.nutritional.decreaseFoodIntake);
      setRadioVal('nutriSupplements', asm.nutritional.supplements);
      setRadioVal('nutriSuggested', asm.nutritional.suggestedAssessment);
      setRadioVal('nutriStatus', asm.nutritional.status);
      if (asm.nutritional.dietaryAdvice) {
        document.getElementById('dietaryAdvice').value = asm.nutritional.dietaryAdvice;
      }
    }

    if (asm.mental) {
      setRadioVal('mentalSheet', asm.mental.sheetAttached);
      if (asm.mental.status) document.getElementById('mentalStatus').value = asm.mental.status;
      if (asm.mental.psychological) document.getElementById('psychologicalAssessment').value = asm.mental.psychological;
      if (asm.mental.notes) document.getElementById('mentalNotes').value = asm.mental.notes;
    }

    if (asm.antenatal) {
      setRadioVal('antenatalSheet', asm.antenatal.sheetAttached);
      if (asm.antenatal.notes) document.getElementById('antenatalNotes').value = asm.antenatal.notes;
    }

    const pContainer = document.getElementById('presentingComplaintsList');
    if (pContainer) {
      pContainer.innerHTML = '';
      if (asm.presentingComplaints && asm.presentingComplaints.length > 0) {
        asm.presentingComplaints.forEach(c => addComplaintRow('presentingComplaintsList', c.complaint, c.duration));
      } else {
        addComplaintRow('presentingComplaintsList', '', '');
      }
    }

    const aContainer = document.getElementById('associatedComplaintsList');
    if (aContainer) {
      aContainer.innerHTML = '';
      if (asm.associatedComplaints && asm.associatedComplaints.length > 0) {
        asm.associatedComplaints.forEach(c => addComplaintRow('associatedComplaintsList', c.complaint, c.duration));
      } else {
        addComplaintRow('associatedComplaintsList', '', '');
      }
    }

    if (asm.doctorNotes) {
      document.getElementById('doctorClinicalFindings').value = asm.doctorNotes.clinicalFindings || '';
      document.getElementById('doctorDiagnosis').value = asm.doctorNotes.diagnosis || '';
      document.getElementById('doctorTreatment').value = asm.doctorNotes.treatment || '';
      document.getElementById('doctorFollowUp').value = asm.doctorNotes.followUp || '';
    }
  }

  function resetCheckupForm() {
    const fieldsToClear = [
      'cuRoomNo', 'cuDateOfAdmission', 'cuDateOfDischarge',
      'vitalBpSystolic', 'vitalBpDiastolic', 'vitalPulse', 'vitalTemp',
      'vitalHeight', 'vitalWeight', 'vitalSpo2', 'vitalRespRate',
      'painLocation', 'painDuration', 'painDescription',
      'dietaryAdvice', 'mentalStatus', 'psychologicalAssessment', 'mentalNotes',
      'antenatalNotes', 'doctorClinicalFindings', 'doctorDiagnosis',
      'doctorTreatment', 'doctorFollowUp'
    ];

    fieldsToClear.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    document.getElementById('calculatedBmiVal').textContent = '--';
    document.getElementById('bmiClassificationBadge').style.display = 'none';

    selectPainScore(0);
    ensureComplaintRows();
  }

  function ensureComplaintRows() {
    const pContainer = document.getElementById('presentingComplaintsList');
    if (pContainer && pContainer.children.length === 0) {
      addComplaintRow('presentingComplaintsList', '', '');
    }
    const aContainer = document.getElementById('associatedComplaintsList');
    if (aContainer && aContainer.children.length === 0) {
      addComplaintRow('associatedComplaintsList', '', '');
    }
  }

  function setRadioVal(name, val) {
    if (!val) return;
    const radio = document.querySelector(`input[name="${name}"][value="${val}"]`);
    if (radio) radio.checked = true;
  }

  function getRadioVal(name) {
    const radio = document.querySelector(`input[name="${name}"]:checked`);
    return radio ? radio.value : '';
  }

  function handleSaveCheckup() {
    const activePatient = getActivePatient();
    if (!activePatient) {
      showToast('No active patient selected for check-up.', 'error');
      return;
    }

    const regNo = activePatient.regNo;
    const physician = document.getElementById('cuPhysician')?.value.trim() || 'Dr. Sandra M George';
    const assessmentDate = document.getElementById('cuAssessmentDate')?.value || new Date().toISOString().split('T')[0];
    const assessmentTime = document.getElementById('cuAssessmentTime')?.value || '';
    const roomNo = document.getElementById('cuRoomNo')?.value.trim() || '';
    const dateOfAdmission = document.getElementById('cuDateOfAdmission')?.value || '';
    const dateOfDischarge = document.getElementById('cuDateOfDischarge')?.value || '';

    const bpSystolic = parseInt(document.getElementById('vitalBpSystolic')?.value, 10) || null;
    const bpDiastolic = parseInt(document.getElementById('vitalBpDiastolic')?.value, 10) || null;
    const pulse = parseInt(document.getElementById('vitalPulse')?.value, 10) || null;
    const temp = parseFloat(document.getElementById('vitalTemp')?.value) || null;
    const height = parseFloat(document.getElementById('vitalHeight')?.value) || null;
    const weight = parseFloat(document.getElementById('vitalWeight')?.value) || null;
    const spo2 = parseInt(document.getElementById('vitalSpo2')?.value, 10) || null;
    const respRate = parseInt(document.getElementById('vitalRespRate')?.value, 10) || null;

    let bmi = null;
    let bmiCategory = '';
    if (height && weight) {
      const hm = height / 100;
      bmi = parseFloat((weight / (hm * hm)).toFixed(2));
      if (bmi < 18.5) bmiCategory = 'Underweight';
      else if (bmi < 25) bmiCategory = 'Normal Weight';
      else if (bmi < 30) bmiCategory = 'Overweight';
      else bmiCategory = 'Obese';
    }

    const painLocation = document.getElementById('painLocation')?.value.trim() || '';
    const painDuration = document.getElementById('painDuration')?.value.trim() || '';
    const painDescription = document.getElementById('painDescription')?.value.trim() || '';

    const presentingComplaints = [];
    document.querySelectorAll('#presentingComplaintsList .complaint-row-item').forEach(row => {
      const comp = row.querySelector('.complaint-input')?.value.trim();
      const dur = row.querySelector('.duration-input')?.value.trim();
      if (comp) presentingComplaints.push({ complaint: comp, duration: dur });
    });

    const associatedComplaints = [];
    document.querySelectorAll('#associatedComplaintsList .complaint-row-item').forEach(row => {
      const comp = row.querySelector('.complaint-input')?.value.trim();
      const dur = row.querySelector('.duration-input')?.value.trim();
      if (comp) associatedComplaints.push({ complaint: comp, duration: dur });
    });

    const clinicalFindings = document.getElementById('doctorClinicalFindings')?.value.trim() || '';
    const diagnosis = document.getElementById('doctorDiagnosis')?.value.trim() || '';
    const treatment = document.getElementById('doctorTreatment')?.value.trim() || '';
    const followUp = document.getElementById('doctorFollowUp')?.value || '';

    const assessmentRecord = {
      id: `ASM_${regNo}_${Date.now()}`,
      regNo: regNo,
      assessmentDate: assessmentDate,
      assessmentTime: assessmentTime,
      physician: physician,
      roomNo: roomNo,
      dateOfAdmission: dateOfAdmission,
      dateOfDischarge: dateOfDischarge,
      vitals: {
        bpSystolic, bpDiastolic, pulse, temp, tempUnit: '°F', height, weight, bmi, bmiCategory, spo2, respRate
      },
      pain: {
        score: state.selectedPainScore,
        descriptionLevel: getPainScoreLabel(state.selectedPainScore),
        location: painLocation,
        duration: painDuration,
        description: painDescription
      },
      nutritional: {
        built: getRadioVal('nutriBuilt') || 'Normal',
        unintentionalWeightLoss: getRadioVal('nutriWeightLoss') || 'No',
        decreaseFoodIntake: getRadioVal('nutriDecreaseFood') || 'No',
        supplements: getRadioVal('nutriSupplements') || 'No',
        suggestedAssessment: getRadioVal('nutriSuggested') || 'No',
        status: getRadioVal('nutriStatus') || 'Normal',
        dietaryAdvice: document.getElementById('dietaryAdvice')?.value.trim() || ''
      },
      mental: {
        sheetAttached: getRadioVal('mentalSheet') || 'Not applicable',
        status: document.getElementById('mentalStatus')?.value.trim() || '',
        psychological: document.getElementById('psychologicalAssessment')?.value.trim() || '',
        notes: document.getElementById('mentalNotes')?.value.trim() || ''
      },
      antenatal: {
        sheetAttached: getRadioVal('antenatalSheet') || 'Not applicable',
        notes: document.getElementById('antenatalNotes')?.value.trim() || ''
      },
      presentingComplaints: presentingComplaints,
      associatedComplaints: associatedComplaints,
      doctorNotes: {
        clinicalFindings, diagnosis, treatment, followUp
      },
      updatedAt: new Date().toISOString()
    };

    const existingIndex = state.assessments.findIndex(a => a.regNo === regNo);
    if (existingIndex >= 0) {
      state.assessments[existingIndex] = assessmentRecord;
    } else {
      state.assessments.unshift(assessmentRecord);
    }

    saveAssessments();
    showToast(`Check-up Assessment Saved for ${activePatient.name} (${regNo})!`, 'success');
  }

  /* --------------------------------------------------------------------------
     4. PAIN SCALE CONTROLLER
     -------------------------------------------------------------------------- */
  function setupPainScale() {
    const painCards = document.querySelectorAll('.pain-level-card');
    painCards.forEach(card => {
      card.addEventListener('click', function () {
        const score = parseInt(this.getAttribute('data-score'), 10);
        selectPainScore(score);
      });
    });
    selectPainScore(0);
  }

  function selectPainScore(score) {
    state.selectedPainScore = score;
    const painCards = document.querySelectorAll('.pain-level-card');
    painCards.forEach(card => {
      const cardScore = parseInt(card.getAttribute('data-score'), 10);
      if (cardScore === score) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });

    const summaryScoreEl = document.getElementById('selectedPainScoreDisplay');
    const summaryTextEl = document.getElementById('selectedPainTextDisplay');
    if (summaryScoreEl) summaryScoreEl.textContent = `${score} / 10`;
    if (summaryTextEl) summaryTextEl.textContent = getPainScoreLabel(score);
  }

  function getPainScoreLabel(score) {
    switch (score) {
      case 0: return 'No Hurt (Relaxed & Comfortable)';
      case 2: return 'Hurts Little Bit (Mild Discomfort)';
      case 4: return 'Hurts Little More (Moderate Pain)';
      case 6: return 'Hurts Even More (Distressing Pain)';
      case 8: return 'Hurts Whole Lot (Severe & Intense)';
      case 10: return 'Hurts Worst (Unbearable / Excruciating)';
      default: return 'Assessed';
    }
  }

  /* --------------------------------------------------------------------------
     5. PATIENTS DIRECTORY & SEARCH
     -------------------------------------------------------------------------- */
  function setupPatientDirectory() {
    const searchInput = document.getElementById('patientSearchInput');
    const filterChips = document.querySelectorAll('.dir-filter-chip');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchFilterText = e.target.value.toLowerCase().trim();
        renderPatientsTable();
      });
    }

    filterChips.forEach(chip => {
      chip.addEventListener('click', function () {
        filterChips.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        state.searchTypeFilter = this.getAttribute('data-filter') || 'ALL';
        renderPatientsTable();
      });
    });
  }

  function renderPatientsTable() {
    const tableBody = document.getElementById('patientsTableBody');
    const countBadge = document.getElementById('patientsCountBadge');
    if (!tableBody) return;

    let filtered = state.patients.filter(p => {
      const matchesSearch = !state.searchFilterText ||
        p.name.toLowerCase().includes(state.searchFilterText) ||
        p.regNo.toLowerCase().includes(state.searchFilterText) ||
        p.contact.includes(state.searchFilterText);

      let matchesType = true;
      if (state.searchTypeFilter === 'OP') matchesType = (p.careType === 'OP');
      else if (state.searchTypeFilter === 'IP') matchesType = (p.careType === 'IP');
      else if (state.searchTypeFilter === 'WITH_CHECKUP') {
        matchesType = state.assessments.some(a => a.regNo === p.regNo);
      }

      return matchesSearch && matchesType;
    });

    if (countBadge) {
      countBadge.textContent = `${filtered.length} Patients Found`;
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
            <div>🔍 No patient records matching your search query.</div>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map(patient => {
      const hasAssessment = state.assessments.some(a => a.regNo === patient.regNo);
      const avatarSrc = patient.photoUrl || HOSPITAL_CONFIG.logoPath;

      return `
        <tr>
          <td>
            <div class="patient-table-cell-user">
              <img src="${avatarSrc}" class="table-avatar-img" alt="${escapeHtml(patient.name)}" onerror="this.src='${HOSPITAL_CONFIG.logoPath}'" />
              <div>
                <div class="table-patient-name">${escapeHtml(patient.name)}</div>
                <div class="table-patient-sub">Age: ${patient.age} • ${patient.gender} • Blood: ${patient.bloodGroup || '-'}</div>
              </div>
            </div>
          </td>
          <td><span class="table-reg-badge">${patient.regNo}</span></td>
          <td>${escapeHtml(patient.contact)}</td>
          <td>${escapeHtml(patient.regDate || '-')}</td>
          <td>
            <span class="badge-tag ${patient.careType === 'IP' ? 'gold' : 'blue'}">${patient.careType || 'OP'} (₹${patient.fee || 250})</span>
          </td>
          <td>
            ${hasAssessment ? '<span class="badge-tag green">✓ Assessment Done</span>' : '<span class="badge-tag" style="background:#f1f5f9;color:#64748b;">Pending Check-up</span>'}
          </td>
          <td>
            <div class="action-buttons-group">
              <button class="btn btn-sm btn-primary" onclick="window.ESH_APP.openCheckupForPatient('${patient.regNo}')">
                🩺 Check-up
              </button>
              <button class="btn btn-sm btn-outline-primary" onclick="window.ESH_APP.viewPatientCard('${patient.regNo}')">
                🆔 Card
              </button>
              <button class="btn btn-sm btn-secondary" onclick="window.ESH_APP.viewPatientHistory('${patient.regNo}')">
                📊 History
              </button>
              <button class="btn btn-sm btn-danger-outline" onclick="window.ESH_APP.deletePatient('${patient.regNo}')">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  /* --------------------------------------------------------------------------
     6. PATIENT CLINICAL HISTORY VIEW
     -------------------------------------------------------------------------- */
  function renderPatientHistory(regNo) {
    const patient = state.patients.find(p => p.regNo === regNo) || state.patients[0];
    const container = document.getElementById('patientHistoryContainer');
    if (!container) return;

    if (!patient) {
      container.innerHTML = `<div style="text-align: center; padding: 50px;">No patient selected.</div>`;
      return;
    }

    const patientAssessments = state.assessments.filter(a => a.regNo === patient.regNo);

    let timelineHtml = '';
    if (patientAssessments.length === 0) {
      timelineHtml = `
        <div style="background:#ffffff; border:1px dashed var(--border-card); border-radius:var(--radius-md); padding:40px; text-align:center;">
          <div style="font-size:2rem; margin-bottom:10px;">🩺</div>
          <h4>No clinical assessments recorded yet for ${escapeHtml(patient.name)}.</h4>
          <p style="color:var(--text-muted); margin:10px 0 20px;">Open the Check-up screen to complete initial OP/IP assessment.</p>
          <button class="btn btn-primary" onclick="window.ESH_APP.openCheckupForPatient('${patient.regNo}')">
            → Start Initial Check-up Assessment
          </button>
        </div>
      `;
    } else {
      timelineHtml = `
        <div class="history-timeline">
          ${patientAssessments.map(asm => `
            <div class="timeline-event-card">
              <div class="event-header">
                <div>
                  <div class="event-date">📅 Visit: ${asm.assessmentDate || 'Recent'} at ${asm.assessmentTime || ''}</div>
                  <div class="event-doctor">Treating Physician: ${escapeHtml(asm.physician || 'Dr. Sandra M George')}</div>
                </div>
                <button class="btn btn-sm btn-outline-primary" onclick="window.ESH_APP.printSpecificAssessment('${asm.regNo}')">
                  🖨️ Print Form ESH/CS/F-1
                </button>
              </div>

              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin:14px 0; background:var(--bg-input); padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border-input);">
                <div><strong style="color:var(--text-muted); font-size:0.75rem;">BLOOD PRESSURE</strong><div style="font-size:1rem; font-weight:800;">${asm.vitals?.bpSystolic || '-'}/${asm.vitals?.bpDiastolic || '-'} mmHg</div></div>
                <div><strong style="color:var(--text-muted); font-size:0.75rem;">PULSE</strong><div style="font-size:1rem; font-weight:800;">${asm.vitals?.pulse || '-'} bpm</div></div>
                <div><strong style="color:var(--text-muted); font-size:0.75rem;">TEMP</strong><div style="font-size:1rem; font-weight:800;">${asm.vitals?.temp || '-'} °F</div></div>
                <div><strong style="color:var(--text-muted); font-size:0.75rem;">HEIGHT / WEIGHT</strong><div style="font-size:1rem; font-weight:800;">${asm.vitals?.height || '-'} cm / ${asm.vitals?.weight || '-'} kg</div></div>
                <div><strong style="color:var(--text-muted); font-size:0.75rem;">BMI</strong><div style="font-size:1rem; font-weight:800; color:var(--color-primary);">${asm.vitals?.bmi || '-'} (${asm.vitals?.bmiCategory || 'Normal'})</div></div>
                <div><strong style="color:var(--text-muted); font-size:0.75rem;">PAIN SCORE</strong><div style="font-size:1rem; font-weight:800; color:#b91c1c;">${asm.pain?.score || 0} / 10</div></div>
              </div>

              <div style="margin:14px 0;">
                <h5 style="font-size:0.85rem; font-weight:700; color:var(--color-primary-dark); text-transform:uppercase;">Presenting Complaints:</h5>
                <ul style="margin-left:20px; font-size:0.88rem; color:var(--text-main); margin-top:4px;">
                  ${asm.presentingComplaints?.map(c => `<li><strong>${escapeHtml(c.complaint)}</strong> - <em>${escapeHtml(c.duration)}</em></li>`).join('') || '<li>None noted</li>'}
                </ul>
                ${asm.associatedComplaints?.length ? `
                  <h5 style="font-size:0.85rem; font-weight:700; color:var(--color-primary-dark); text-transform:uppercase; margin-top:8px;">Associated Complaints:</h5>
                  <ul style="margin-left:20px; font-size:0.88rem; color:var(--text-main); margin-top:4px;">
                    ${asm.associatedComplaints.map(c => `<li><strong>${escapeHtml(c.complaint)}</strong> - <em>${escapeHtml(c.duration)}</em></li>`).join('')}
                  </ul>
                ` : ''}
              </div>

              <div style="background:#ffffff; border:1px solid #d8e6f1; border-radius:var(--radius-sm); padding:14px; margin-top:10px;">
                <div style="margin-bottom:8px;">
                  <strong style="color:var(--color-primary); font-size:0.8rem; text-transform:uppercase;">Clinical Findings:</strong>
                  <div style="font-size:0.88rem; color:var(--text-main); white-space:pre-line;">${escapeHtml(asm.doctorNotes?.clinicalFindings || 'None')}</div>
                </div>
                <div style="margin-bottom:8px;">
                  <strong style="color:var(--color-primary); font-size:0.8rem; text-transform:uppercase;">Diagnosis:</strong>
                  <div style="font-size:0.92rem; font-weight:700; color:var(--color-primary-dark); white-space:pre-line;">${escapeHtml(asm.doctorNotes?.diagnosis || 'Pending')}</div>
                </div>
                <div>
                  <strong style="color:var(--color-primary); font-size:0.8rem; text-transform:uppercase;">Treatment & Ayurvedic Advice:</strong>
                  <div style="font-size:0.88rem; color:var(--text-main); white-space:pre-line;">${escapeHtml(asm.doctorNotes?.treatment || 'Under evaluation')}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    container.innerHTML = `
      <div style="background:#ffffff; border:1px solid var(--border-card); border-radius:var(--radius-lg); padding:24px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
          <div style="display:flex; align-items:center; gap:16px;">
            <img src="${patient.photoUrl || HOSPITAL_CONFIG.logoPath}" style="width:64px; height:64px; border-radius:50%; border:2px solid var(--color-primary); object-fit:cover;" onerror="this.src='${HOSPITAL_CONFIG.logoPath}'" />
            <div>
              <h2 style="font-size:1.3rem; font-weight:800; color:var(--color-primary-dark);">${escapeHtml(patient.name)}</h2>
              <div style="font-size:0.8rem; color:var(--text-muted); display:flex; gap:12px; margin-top:2px;">
                <span>Reg No: <strong>${patient.regNo}</strong></span>
                <span>Age: <strong>${patient.age}</strong></span>
                <span>Sex: <strong>${patient.gender}</strong></span>
                <span>Blood: <strong>${patient.bloodGroup || '-'}</strong></span>
                <span>Contact: <strong>${patient.contact}</strong></span>
              </div>
            </div>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-primary" onclick="window.ESH_APP.openCheckupForPatient('${patient.regNo}')">
              🩺 New / Edit Check-up
            </button>
            <button class="btn btn-outline-primary" onclick="window.ESH_APP.viewPatientCard('${patient.regNo}')">
              🆔 View Card
            </button>
          </div>
        </div>
      </div>

      <div style="background:#ffffff; border:1px solid var(--border-card); border-radius:var(--radius-lg); padding:24px; box-shadow:var(--shadow-sm);">
        <div class="card-header-styled">
          <div class="card-title-group">
            <div class="card-title-icon">📜</div>
            <div>
              <div class="card-title">Clinical Assessments & Medical History</div>
              <div class="card-subtitle">Comprehensive timeline of OP/IP evaluations for ${escapeHtml(patient.name)}</div>
            </div>
          </div>
        </div>
        ${timelineHtml}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     7. WEBCAM SUPPORT
     -------------------------------------------------------------------------- */
  function setupCameraModal() {
    const btnOpenCam = document.getElementById('btnOpenCameraModal');
    const btnSnap = document.getElementById('btnSnapCameraPhoto');
    const btnCancelCam = document.getElementById('btnCancelCamera');

    if (btnOpenCam) {
      btnOpenCam.addEventListener('click', openCameraModal);
    }
    if (btnSnap) {
      btnSnap.addEventListener('click', snapCameraPhoto);
    }
    if (btnCancelCam) {
      btnCancelCam.addEventListener('click', () => {
        stopCamera();
        closeModal('cameraModal');
      });
    }
  }

  function openCameraModal() {
    const modal = document.getElementById('cameraModal');
    const video = document.getElementById('webcamVideo');
    if (!modal || !video) return;

    modal.classList.add('active');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
        .then(stream => {
          state.cameraStream = stream;
          video.srcObject = stream;
          video.play();
        })
        .catch(err => {
          console.error('Camera access error:', err);
          showToast('Could not access camera. Please check permissions.', 'error');
          stopCamera();
          closeModal('cameraModal');
        });
    } else {
      showToast('Camera not supported in this browser.', 'warning');
    }
  }

  function snapCameraPhoto() {
    const video = document.getElementById('webcamVideo');
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    state.uploadedPhotoDataUrl = dataUrl;
    renderPhotoPreview(dataUrl);

    stopCamera();
    closeModal('cameraModal');
    showToast('Photo captured successfully.', 'success');
  }

  function stopCamera() {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach(track => track.stop());
      state.cameraStream = null;
    }
  }

  function openPatientSelectorModal() {
    const modal = document.getElementById('patientSelectorModal');
    const listContainer = document.getElementById('patientSelectList');
    if (!modal || !listContainer) return;

    listContainer.innerHTML = state.patients.map(p => `
      <div class="patient-select-item" onclick="window.ESH_APP.selectActivePatientFromModal('${p.regNo}')" style="display:flex; align-items:center; justify-content:space-between; padding:12px; border-bottom:1px solid #edf2f7; cursor:pointer;">
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="${p.photoUrl || HOSPITAL_CONFIG.logoPath}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;" onerror="this.src='${HOSPITAL_CONFIG.logoPath}'" />
          <div>
            <div style="font-weight:700; color:var(--color-primary-dark);">${escapeHtml(p.name)}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${p.regNo} • Age: ${p.age} • ${p.contact}</div>
          </div>
        </div>
        <button class="btn btn-sm btn-outline-primary">Select</button>
      </div>
    `).join('');

    modal.classList.add('active');
  }

  /* --------------------------------------------------------------------------
     8. PRINT ENGINES
     -------------------------------------------------------------------------- */
  function printRegistrationCard(patient) {
    document.body.classList.add('printing-card');
    document.body.classList.remove('printing-assessment');

    openRegistrationCardModal(patient);

    setTimeout(() => {
      window.print();
      document.body.classList.remove('printing-card');
    }, 200);
  }

  function printCheckupChart() {
    const activePatient = getActivePatient();
    if (!activePatient) {
      showToast('No active patient selected to print.', 'error');
      return;
    }

    document.body.classList.add('printing-assessment');
    document.body.classList.remove('printing-card');

    setTimeout(() => {
      window.print();
      document.body.classList.remove('printing-assessment');
    }, 200);
  }

  /* --------------------------------------------------------------------------
     UTILITIES
     -------------------------------------------------------------------------- */
  function compressAndPreviewImage(file, maxWidth, maxHeight, callback) {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        callback(dataUrl);
      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  }

  function generateBarcodeSvg(text) {
    let rects = '';
    let x = 10;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      const w1 = (code % 3) + 1;
      const w2 = ((code * 2) % 3) + 1;
      rects += `<rect x="${x}" y="0" width="${w1}" height="38" fill="#132736" />`;
      x += w1 + 2;
      rects += `<rect x="${x}" y="0" width="${w2}" height="38" fill="#132736" />`;
      x += w2 + 2;
    }
    return `<svg class="svg-barcode" viewBox="0 0 ${Math.max(x + 10, 220)} 38" preserveAspectRatio="none">${rects}</svg>`;
  }

  function generateAvatarSvg(name) {
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('');
    return `
      <svg width="100%" height="100%" viewBox="0 0 100 120" style="background:#eaf2f8;">
        <rect width="100%" height="100%" fill="#e8f1f7" />
        <circle cx="50" cy="45" r="24" fill="#adc5d6" />
        <path d="M 20 110 C 20 80, 80 80, 80 110 Z" fill="#adc5d6" />
        <text x="50" y="52" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">${initials}</text>
      </svg>
    `;
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    else if (type === 'error') icon = '⚠️';
    else if (type === 'warning') icon = '🔔';

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">${escapeHtml(message)}</div>
      <button class="toast-close">&times;</button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.remove();
    });

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Global Exports for Inline Handlers
  window.ESH_APP = {
    openCheckupForPatient: function (regNo) {
      setActivePatient(regNo);
      switchView('checkup');
    },
    viewPatientCard: function (regNo) {
      const patient = state.patients.find(p => p.regNo === regNo);
      if (patient) openRegistrationCardModal(patient);
    },
    viewPatientHistory: function (regNo) {
      setActivePatient(regNo);
      switchView('history');
    },
    deletePatient: function (regNo) {
      const patient = state.patients.find(p => p.regNo === regNo);
      if (!patient) return;
      if (confirm(`Are you sure you want to delete patient ${patient.name} (${regNo})?`)) {
        state.patients = state.patients.filter(p => p.regNo !== regNo);
        state.assessments = state.assessments.filter(a => a.regNo !== regNo);
        savePatients();
        saveAssessments();
        if (state.activePatientReg === regNo) {
          state.activePatientReg = state.patients.length > 0 ? state.patients[0].regNo : null;
          renderActivePatientIndicator();
        }
        renderPatientsTable();
        showToast('Patient record deleted.', 'info');
      }
    },
    selectActivePatientFromModal: function (regNo) {
      setActivePatient(regNo);
      closeModal('patientSelectorModal');
      showToast(`Selected active patient: ${regNo}`, 'info');
    },
    printSpecificAssessment: function (regNo) {
      loadPatientIntoCheckup(regNo);
      printCheckupChart();
    },
    closeModal: closeModal
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
