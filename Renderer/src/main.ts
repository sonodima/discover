import Log from './log';
import Renderer from './renderer';

import './style.css'


const log = new Log();

const renderer = new Renderer(log);


renderer.intialize();