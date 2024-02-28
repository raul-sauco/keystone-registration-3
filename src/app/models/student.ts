import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export class Student {
  id: number;
  index?: number;
  type?: number; // 1 for teacher, 0 for student
  isSampleAccount!: boolean;
  name?: string;
  englishName?: string;
  citizenship?: string;
  travelDocument?: string;
  gender?: number;
  dob?: string;
  guardianName?: string;
  emergencyContact?: string;
  email?: string;
  wechatId?: string;
  waiverAccepted: boolean | null = null;
  waiverSignedOn?: string;
  dietaryRequirements?: number;
  dietaryRequirementsOther?: string;
  allergies?: number;
  allergiesOther?: string;
  medicalInformation?: string;
  termsAccepted: boolean | null = null;
  termsAcceptedOn?: string;
  paid: boolean | null = null;
  paymentVerified: boolean | null = null;
  house: string | null = null;
  roomNumber: string | null = null;

  private translations: any;

  private personalAttributes: any;
  private legalAttributes: any;
  private dietaryAttributes: any;
  private medicalAttributes: any;

  constructor(
    json: any,
    private translate: TranslateService,
  ) {
    // Set the ID attribute only at creation
    this.id = json.id;
    this.setFromJSON(json);
    this.getTranslations();
    this.setAttributeArrays();
  }

  /**
   * Get all translations from TranslateService
   */
  private getTranslations() {
    this.translate
      .get([
        'ID',
        'INDEX',
        'NAME',
        'ENGLISH_NAME',
        'CITIZENSHIP',
        'TRAVEL_DOCUMENT',
        'TRAVEL_DOCUMENT_NUMBER',
        'GENDER',
        'G',
        'DOB',
        'GUARDIAN_NAME',
        'EMERGENCY_CONTACT',
        'EMAIL',
        'WECHAT_ID',
        'WAIVER_ACCEPTED',
        'WAIVER_SIGNED_ON',
        'DR',
        'DIETARY_REQUIREMENTS',
        'DIETARY_REQUIREMENTS_OTHER',
        'ALLER',
        'ALLERGIES',
        'ALLERGIES_OTHER',
        'MEDICAL_INFORMATION',
        'PAID',
        'PAYMENT_VERIFIED',
        'SCHOOL_HOUSE',
        'ROOM_NUMBER',
        // 'INSURANCE',
        // 'I',
        // 'INSURANCE_NAME',
        // 'INSURANCE_POLICY_NUMBER',
        'YES',
        'NO',
        'EMPTY',
        'COUNTRY_OF_CITIZENSHIP',
        'TEACHER',
        'STUDENT',
      ])
      .subscribe((res) => (this.translations = res));
  }

  /**
   * Use JSON data to set this student's attributes.
   */
  private setFromJSON(json: any) {
    // Use the id attribute for creation scenarios
    this.id = json.id;
    this.type = json.type;
    this.isSampleAccount =
      json.is_sample_account === true ||
      json.is_sample_account === '1' ||
      json.is_sample_account === 1;
    this.name = json.name;
    this.englishName = json.english_name;
    this.citizenship = json.citizenship;
    this.travelDocument = json.travel_document;
    this.gender = json.gender;
    this.dob = json.dob;
    this.guardianName = json.guardian_name;
    this.emergencyContact = json.emergency_contact;
    this.email = json.email;
    this.wechatId = json.wechat_id;
    this.waiverAccepted = json.waiver_accepted
      ? true
      : json.waiver_accepted === 0
        ? false
        : null;
    this.waiverSignedOn = json.waiver_signed_on;
    this.dietaryRequirements = json.dietary_requirements;
    this.dietaryRequirementsOther = json.dietary_requirements_other;
    this.allergies = json.allergies;
    this.allergiesOther = json.allergies_other;
    this.medicalInformation = json.medical_information;
    this.termsAccepted = json.terms_accepted
      ? true
      : json.terms_accepted === 0
        ? false
        : null;
    this.termsAcceptedOn = json.terms_accepted_on;
    this.paid = json.paid ? true : json.paid === 0 ? false : null;
    this.paymentVerified = json.payment_verified
      ? true
      : json.payment_verified === 0
        ? false
        : null;
    this.house = json.house;
    this.roomNumber = json.room_number;
    // this.insurance = json.insurance;
    // this.insuranceName = json.insurance_name;
    // this.insurancePolicyNumber = json.insurance_policy_number;
  }

  /**
   * Get the i18n attribute name.
   */
  public getAttributeLabel(attribute: string) {
    const labels: { [key: string]: string } = {
      id: this.translations.ID,
      name: this.translations.NAME,
      englishName: this.translations.ENGLISH_NAME,
      citizenship: this.translations.COUNTRY_OF_CITIZENSHIP,
      travelDocument: this.translations.TRAVEL_DOCUMENT_NUMBER,
      gender: this.translations.GENDER,
      dob: this.translations.DOB,
      guardianName: this.translations.GUARDIAN_NAME,
      emergencyContact: this.translations.EMERGENCY_CONTACT,
      email: this.translations.EMAIL,
      wechatId: this.translations.WECHAT_ID,
      waiverAccepted: this.translations.WAIVER_ACCEPTED,
      waiverSignedOn: this.translations.WAIVER_SIGNED_ON,
      dietaryRequirements: this.translations.DIETARY_REQUIREMENTS,
      dietaryRequirementsOther: this.translations.DIETARY_REQUIREMENTS_OTHER,
      allergies: this.translations.ALLERGIES,
      allergiesOther: this.translations.ALLERGIES_OTHER,
      medicalInformation: this.translations.MEDICAL_INFORMATION,
      paid: this.translations.PAID,
      paymentVerified: this.translations.PAYMENT_VERIFIED,
      house: this.translations.SCHOOL_HOUSE,
      roomNumber: this.translations.ROOM_NUMBER,
      // insurance: this.translations.INSURANCE,
      // insuranceName: this.translations.INSURANCE_NAME,
      // insurancePolicyNumber: this.translations.INSURANCE_POLICY_NUMBER,
    };
    return labels[attribute] || '';
  }

  /**
   * Get the attribute value element content.
   */
  public getAttributeText(attr: keyof Student) {
    if (attr === 'type') {
      if (this[attr]) {
        return this.translations.TEACHER;
      }
      return this.translations.STUDENT;
    }
    if (typeof this[attr] === 'boolean') {
      if (this[attr] === true) {
        return this.translations.YES;
      } else {
        return this.translations.NO;
      }
    }
    if (attr === 'gender') {
      return this.translations.G[this['gender']!];
    }
    // if (attr === 'insurance') {
    //   return this.translations.I[this[attr]];
    // }
    if (attr === 'dietaryRequirements' && this['dietaryRequirements']) {
      return this.translations.DR[this['dietaryRequirements']];
    }
    if (attr === 'allergies' && this['allergies']) {
      return this.translations.ALLER[this['allergies']];
    }

    if (!this[attr]) {
      return '';
    }

    // Customize a few attributes
    if (attr === 'waiverSignedOn' || attr === 'dob') {
      return formatDate(
        this[attr] || '',
        'longDate',
        this.translate.currentLang.includes('zh') ? 'zh' : 'en-US',
      );
    }

    return this[attr];
  }

  /**
   * Hide the teachers medical information from the participants table
   * @param attr
   */
  getParticipantTableDisplayValue(attr: keyof Student) {
    if (attr === 'medicalInformation' && this.type === 1) {
      return '';
    }
    return this.getAttributeText(attr);
  }

  /**
   * Find out whether an attribute is null.
   */
  isAttributeEmpty(attr: keyof Student): boolean {
    if (typeof this[attr] === 'boolean') {
      return false;
    }

    if (typeof this[attr] === 'number') {
      return this[attr] === null;
    }
    // This works as expected for empty booleans.
    return !this[attr];
  }

  getPersonalAttributes() {
    return this.personalAttributes;
  }

  getLegalAttributes() {
    return this.legalAttributes;
  }

  getDietaryAttributes() {
    return this.dietaryAttributes;
  }

  getMedicalAttributes() {
    return this.medicalAttributes;
  }

  isStudent(): boolean {
    return this.type === 0;
  }

  isTeacher(): boolean {
    return this.type === 1;
  }

  /**
   * Initialize the class attribute arrays
   */
  setAttributeArrays() {
    this.personalAttributes = [
      { name: 'name', visible: true },
      { name: 'englishName', visible: true },
      { name: 'citizenship', visible: true },
      { name: 'travelDocument', visible: true },
      { name: 'gender', visible: true },
      { name: 'dob', visible: true },
    ];

    this.legalAttributes = [
      { name: 'waiverAccepted', visible: true },
      { name: 'waiverSignedOn', visible: true },
      { name: 'guardianName', visible: true },
      // { name: 'insurance', visible: true },
      // { name: 'insuranceName', visible: this.insurance !== null },
      // { name: 'insurancePolicyNumber', visible: this.insurance !== null },
    ];

    this.dietaryAttributes = [
      { name: 'dietaryRequirements', visible: true },
      {
        name: 'dietaryRequirementsOther',
        visible: this.dietaryRequirements === 1,
      },
    ];

    this.medicalAttributes = [
      { name: 'allergies', visible: true },
      { name: 'allergiesOther', visible: this.allergies === 1 },
      { name: 'medicalInformation', visible: true },
    ];
  }

  /**
   * Set one of the settable Student attributes to a given value.
   * @param attr the Student attribute to set.
   * @param value the value to assign to the attribute.
   */
  public setAttribute(attr: keyof Student, value: string): void {
    switch (attr) {
      case 'name':
        this.name = value;
        break;
      case 'englishName':
        this.englishName = value;
        break;
      case 'citizenship':
        this.citizenship = value;
        break;
      case 'travelDocument':
        this.travelDocument = value;
        break;
      case 'gender':
        this.gender = +value;
        break;
      case 'emergencyContact':
        this.emergencyContact = value;
        break;
      case 'email':
        this.email = value;
        break;
      case 'wechatId':
        this.wechatId = value;
        break;
      case 'dietaryRequirements':
        this.dietaryRequirements = +value;
        break;
      case 'dietaryRequirementsOther':
        this.dietaryRequirementsOther = value;
        break;
      case 'allergies':
        this.allergies = +value;
        break;
      case 'allergiesOther':
        this.allergiesOther = value;
        break;
      case 'medicalInformation':
        this.medicalInformation = value;
        break;
      case 'house':
        this.house = value;
        break;
      case 'roomNumber':
        this.roomNumber = value;
        break;
    }
  }

  /**
   * Check if this participant has already provided, at least, the minimum amount of
   * information required by the trip organizers.
   * Use this method to centralize updates to company policy on what information is required and
   * to support different values for different trips.
   * @returns boolean yes/no
   */
  public hasProvidedInformation(): boolean {
    // Sample accounts are not expected to provide any information.
    if (this.isSampleAccount) {
      return true;
    }
    let provided = true;
    const attrs = ['name', 'travelDocument', 'dob'];
    attrs.forEach((attr) => {
      if (this.isAttributeEmpty(attr as keyof Student)) {
        provided = false;
      }
    });
    return provided;
  }
}
