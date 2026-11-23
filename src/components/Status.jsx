import {LABELS} from '../utils/workflow'
export default function Status({value}) { return <span className={`status ${value||''}`}>{LABELS[value]||value}</span> }
