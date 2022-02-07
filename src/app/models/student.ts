import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

export class Student {
  id: number;
  index?: number;
  type?: number; // 1 for teacher, 0 for student
  firstName?: string;
  lastName?: string;
  citizenship?: string;
  travelDocument?: string;
  gender?: number;
  dob?: string;
  guardianName?: string;
  emergencyContact?: string;
  waiverAccepted: boolean | null = null;
  waiverSignedOn?: string;
  dietaryRequirements?: number;
  dietaryRequirementsOther?: string;
  allergies?: number;
  allergiesOther?: string;
  medicalInformation?: string;
  paid: boolean | null = null;
  paymentVerified: boolean | null = null;
  // insurance: boolean;
  // insuranceName: string;
  // insurancePolicyNumber: string;

  private translations: any;

  private personalAttributes: any;
  private legalAttributes: any;
  private dietaryAttributes: any;
  private medicalAttributes: any;

  constructor(
    json: any,
    private translate: TranslateService,
    private logger: NGXLogger
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
        'FIRST_NAME',
        'LAST_NAME',
        'CITIZENSHIP',
        'TRAVEL_DOCUMENT',
        'TRAVEL_DOCUMENT_NUMBER',
        'GENDER',
        'G',
        'DOB',
        'GUARDIAN_NAME',
        'EMERGENCY_CONTACT',
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
    // Prevent updates if the JSON id does not match
    if (this.id && this.id !== json.id) {
      this.logger.error(
        'Trying to update student with wrong ID parameter',
        json
      );
      return false;
    }

    // Use the id attribute for creation scenarios
    this.id = json.id;
    this.type = json.type;
    this.firstName = json.first_name;
    this.lastName = json.last_name;
    this.citizenship = json.citizenship;
    this.travelDocument = json.travel_document;
    this.gender = json.gender;
    this.dob = json.dob;
    this.guardianName = json.guardian_name;
    this.emergencyContact = json.emergency_contact;
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
    this.paid = json.paid ? true : json.paid === 0 ? false : null;
    this.paymentVerified = json.payment_verified
      ? true
      : json.payment_verified === 0
      ? false
      : null;
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
      firstName: this.translations.FIRST_NAME,
      lastName: this.translations.LAST_NAME,
      citizenship: this.translations.COUNTRY_OF_CITIZENSHIP,
      travelDocument: this.translations.TRAVEL_DOCUMENT_NUMBER,
      gender: this.translations.GENDER,
      dob: this.translations.DOB,
      guardianName: this.translations.GUARDIAN_NAME,
      emergencyContact: this.translations.EMERGENCY_CONTACT,
      waiverAccepted: this.translations.WAIVER_ACCEPTED,
      waiverSignedOn: this.translations.WAIVER_SIGNED_ON,
      dietaryRequirements: this.translations.DIETARY_REQUIREMENTS,
      dietaryRequirementsOther: this.translations.DIETARY_REQUIREMENTS_OTHER,
      allergies: this.translations.ALLERGIES,
      allergiesOther: this.translations.ALLERGIES_OTHER,
      medicalInformation: this.translations.MEDICAL_INFORMATION,
      paid: this.translations.PAID,
      paymentVerified: this.translations.PAYMENT_VERIFIED,
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
      } else if (this[attr] === false) {
        return this.translations.NO;
      } else {
        return '';
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
        this.translate.currentLang.includes('zh') ? 'zh' : 'en-US'
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
      return !(this[attr] === true || this[attr] === false);
    }

    if (typeof this[attr] === 'number') {
      return this[attr] === null;
    }

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

  /**
   * Initialize the class attribute arrays
   */
  setAttributeArrays() {
    this.personalAttributes = [
      { name: 'firstName', visible: true },
      { name: 'lastName', visible: true },
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
      case 'firstName':
        this.firstName = value;
        break;
      case 'lastName':
        this.lastName = value;
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
    }
  }
}
