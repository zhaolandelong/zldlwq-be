// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../app/service/Test';
import ExportTranslate from '../../../app/service/translate';

declare module 'egg' {
  interface IService {
    test: ExportTest;
    translate: ExportTranslate;
  }
}
