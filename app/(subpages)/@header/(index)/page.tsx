import styles from "./home-header.module.css";
import { getPersonalInfo } from '@data/site-config';

export default function HomeHeader() {
    const personalInfo = getPersonalInfo();

    return <div className={styles.heading}>
        <h1>{personalInfo.name.full}</h1>
    </div>
}