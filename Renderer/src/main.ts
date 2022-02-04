import Log from './Log';
import Renderer from './lib/Renderer';

import './style.css'


const log = new Log();

const renderer = new Renderer();
log.write('local', 'Renderer initialized')

renderer.test();

