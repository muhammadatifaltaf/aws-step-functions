#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdksfStack } from '../lib/cdksf-stack';

const app = new cdk.App();
new CdksfStack(app, 'CdksfStack');
