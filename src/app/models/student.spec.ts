import { fakeAsync, tick } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { of } from 'rxjs';
import { Student } from './student';

describe('Student', () => {
  const translations = {
    YES: 'Yes',
    NO: 'No',
    ID: 'ID',
    TEACHER: 'Teacher',
    STUDENT: 'Student',
    G: { 0: 'Gender 0', 2: 'Gender 2' },
    DR: { 1: 'Dietary Requirements 1', 2: 'Dietary Requirements 2' },
    ALLER: { 0: 'Allergy 0', 1: 'Allergy 1', 2: 'Allergy 2' },
  };
  const studentData = {
    id: 1,
    first_name: 'First Name',
    last_name: 'Last Name',
    type: 0,
    paid: 1,
    payment_verified: 1,
    waiver_accepted: 1,
    gender: 0,
    dietary_requirements: 1,
    allergies: 1,
    dob: '2020-01-01',
    medical_information: 'Medical Information',
  };
  const teacherData = {
    id: 1,
    first_name: 'First Name',
    last_name: 'Last Name',
    type: 1,
    paid: 0,
    payment_verified: 0,
    waiver_accepted: null,
    medical_information: 'Medical Information',
  };
  let translateSpy: TranslateService;
  let loggerSpy: NGXLogger;

  beforeEach(() => {
    translateSpy = jasmine.createSpyObj(
      'TranslateService',
      {
        get: of(translations),
      },
      { currentLang: 'en' }
    );
    loggerSpy = jasmine.createSpyObj('NGXLogger', { error: null });
  });

  it('should create an instance', () => {
    const student = new Student(studentData, translateSpy, loggerSpy);
    expect(student).toBeTruthy();
  });

  it('should return attribute labels', fakeAsync(() => {
    const student = new Student(studentData, translateSpy, loggerSpy);
    expect(translateSpy.get).toHaveBeenCalled();
    tick();
    expect(student.getAttributeLabel('id'))
      .withContext('should return the label translation for attributes')
      .toEqual('ID');
    expect(student.getAttributeLabel('non existent attribute'))
      .withContext('should return empty strings for non attributes')
      .toEqual('');
  }));

  describe('should return attribute content', () => {
    it('for id', fakeAsync(() => {
      const student = new Student(studentData, translateSpy, loggerSpy);
      expect(student.getAttributeText('id'))
        .withContext("should return the student's id")
        .toEqual(1);
      expect(student.getAttributeText('type'))
        .withContext("should return the participant's type")
        .toEqual('Student');
    }));

    it('for type', () => {
      const student = new Student(teacherData, translateSpy, loggerSpy);
      expect(student.getAttributeText('type'))
        .withContext("should return the participant's type")
        .toEqual('Teacher');
    });

    it('for booleans', () => {
      const student = new Student(studentData, translateSpy, loggerSpy);
      const teacher = new Student(teacherData, translateSpy, loggerSpy);
      expect(student.getAttributeText('paid')).toEqual('Yes');
      expect(teacher.getAttributeText('paid')).toEqual('No');
      expect(teacher.getAttributeText('waiverAccepted')).toEqual('');
    });

    it('for gender', () => {
      const student = new Student(studentData, translateSpy, loggerSpy);
      expect(student.getAttributeText('gender')).toEqual('Gender 0');
    });

    it('for dietary requirements', () => {
      const student = new Student(studentData, translateSpy, loggerSpy);
      expect(student.getAttributeText('dietaryRequirements')).toEqual(
        'Dietary Requirements 1'
      );
    });

    it('for allergies', () => {
      const student = new Student(studentData, translateSpy, loggerSpy);
      expect(student.getAttributeText('allergies')).toEqual('Allergy 1');
    });

    it('for dob', () => {
      const student = new Student(studentData, translateSpy, loggerSpy);
      expect(student.getAttributeText('dob')).toEqual('January 1, 2020');
    });

    it('for medical info', () => {
      const student = new Student(studentData, translateSpy, loggerSpy);
      const teacher = new Student(teacherData, translateSpy, loggerSpy);
      expect(
        student.getParticipantTableDisplayValue('medicalInformation')
      ).toEqual('Medical Information');
      expect(teacher.getParticipantTableDisplayValue('medicalInformation'))
        .withContext(
          'teacher medical information should not be visible on the participant table'
        )
        .toEqual('');
    });
  });

  describe('attribute control', () => {
    it('for empty attributes', () => {
      const student = new Student(studentData, translateSpy, loggerSpy);
      expect(student.isAttributeEmpty('dob')).toEqual(false);
      expect(student.isAttributeEmpty('paid')).toEqual(false);
      expect(student.isAttributeEmpty('waiverAccepted')).toEqual(false);
      expect(student.isAttributeEmpty('gender')).toEqual(false);
      const teacher = new Student(teacherData, translateSpy, loggerSpy);
      expect(teacher.isAttributeEmpty('waiverAccepted')).toEqual(true);
    });

    it('listing attributes by type', () => {
      const student = new Student(studentData, translateSpy, loggerSpy);
      expect(student.getPersonalAttributes().length).toEqual(7);
      expect(student.getLegalAttributes().length).toEqual(3);
      expect(student.getDietaryAttributes().length).toEqual(2);
      expect(student.getMedicalAttributes().length).toEqual(3);
    });
  });

  describe('setting attributes', () => {
    it('can set', () => {
      const student = new Student(studentData, translateSpy, loggerSpy);
      expect(student.setAttribute('firstName', 'New Name')).toBeUndefined();
      expect(student.getAttributeText('firstName')).toEqual('New Name');
      expect(student.setAttribute('lastName', 'New L Name')).toBeUndefined();
      expect(student.getAttributeText('lastName')).toEqual('New L Name');
      expect(student.setAttribute('englishName', 'New E Name')).toBeUndefined();
      expect(student.getAttributeText('englishName')).toEqual('New E Name');
      expect(
        student.setAttribute('citizenship', 'New Citizenship')
      ).toBeUndefined();
      expect(student.getAttributeText('citizenship')).toEqual(
        'New Citizenship'
      );
      expect(
        student.setAttribute('travelDocument', 'New travel doc')
      ).toBeUndefined();
      expect(student.getAttributeText('travelDocument')).toEqual(
        'New travel doc'
      );
      expect(student.setAttribute('gender', '2')).toBeUndefined();
      expect(student.getAttributeText('gender')).toEqual('Gender 2');
      expect(
        student.setAttribute('emergencyContact', 'New emergencyContact')
      ).toBeUndefined();
      expect(student.getAttributeText('emergencyContact')).toEqual(
        'New emergencyContact'
      );
      expect(student.setAttribute('wechatId', 'New wechatId')).toBeUndefined();
      expect(student.getAttributeText('wechatId')).toEqual('New wechatId');
      expect(student.setAttribute('dietaryRequirements', '2')).toBeUndefined();
      expect(student.getAttributeText('dietaryRequirements')).toEqual(
        'Dietary Requirements 2'
      );
      expect(
        student.setAttribute(
          'dietaryRequirementsOther',
          'New dietaryRequirementsOther'
        )
      ).toBeUndefined();
      expect(student.getAttributeText('dietaryRequirementsOther')).toEqual(
        'New dietaryRequirementsOther'
      );
      expect(student.setAttribute('allergies', '2')).toBeUndefined();
      expect(student.getAttributeText('allergies')).toEqual('Allergy 2');
      expect(
        student.setAttribute('allergiesOther', 'New allergiesOther')
      ).toBeUndefined();
      expect(student.getAttributeText('allergiesOther')).toEqual(
        'New allergiesOther'
      );
      expect(
        student.setAttribute('medicalInformation', 'New medicalInformation')
      ).toBeUndefined();
      expect(student.getAttributeText('medicalInformation')).toEqual(
        'New medicalInformation'
      );
      expect(student.setAttribute('house', 'New house')).toBeUndefined();
      expect(student.getAttributeText('house')).toEqual('New house');
      expect(
        student.setAttribute('roomNumber', 'New roomNumber')
      ).toBeUndefined();
      expect(student.getAttributeText('roomNumber')).toEqual('New roomNumber');
    });
  });

  describe('required information check', () => {
    it('required information has been provided', () => {
      const student = new Student(studentData, translateSpy, loggerSpy);
      expect(student.hasProvidedInformation()).toEqual(false);
      expect(
        student.setAttribute('citizenship', 'New citizenship')
      ).toBeUndefined();
      expect(
        student.setAttribute('travelDocument', 'New travelDocument')
      ).toBeUndefined();
      expect(student.hasProvidedInformation()).toEqual(true);
    });
  });

  describe('hard to reach branches', () => {
    it('required information has been provided', () => {
      const student = new Student(
        {
          id: 1,
          first_name: 'First Name',
          last_name: 'Last Name',
          type: 0,
          waiver_accepted: 0,
          gender: 0,
          dietary_requirements: 1,
          allergies: 1,
          dob: null,
          medical_information: 'Medical Information',
        },
        translateSpy,
        loggerSpy
      );
      expect(student.getAttributeText('waiverSignedOn')).toEqual('');
      expect(student.getAttributeText('dob')).toEqual('');
    });
  });
});
