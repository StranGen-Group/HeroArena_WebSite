import './ContactSection.scss';
import { useLanguage } from '../../context/LanguageContext';
import useInView from '../../hooks/useInView';
import { ANIMATION_CONFIG, ANIMATION_CLASSES } from '../../constants/animation';
import { SECTIONS } from '../../constants/links';

const ContactsSection = () => {
    const { t } = useLanguage();
    const [formRef, formInView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.HIGH });

    return (
        <section className="contacts" id={SECTIONS.CONTACT}>
            <div className="contacts__container">
                <div className="contacts__content">

                    <div 
                        ref={formRef}
                        className={`contacts__form-wrapper ${formInView ? `${ANIMATION_CLASSES.FADE_IN_UP} ${ANIMATION_CLASSES.ANIMATED}` : ANIMATION_CLASSES.HIDDEN}`}
                    >
                        <div className="contacts__form">
                            <div className="contacts__form-header">
                                <div className="contacts__icon contacts__icon--message"></div>
                                <h3 className="contacts__form-title">{t('contactTitle')}</h3>
                            </div>

                            <form className="contacts__form-content">
                                <div className="contacts__field">
                                    <label className="contacts__label">{t('contactName')}</label>
                                    <input
                                        type="text"
                                        className="contacts__input"
                                        placeholder={t('contactNamePlaceholder')}
                                    />
                                </div>

                                <div className="contacts__field">
                                    <label className="contacts__label">{t('contactEmail')}</label>
                                    <input
                                        type="email"
                                        className="contacts__input"
                                        placeholder={t('contactEmailPlaceholder')}
                                    />
                                </div>

                                <div className="contacts__field">
                                    <label className="contacts__label">{t('contactMessage')}</label>
                                    <textarea
                                        className="contacts__textarea"
                                        placeholder={t('contactMessagePlaceholder')}
                                        rows="4"
                                    ></textarea>
                                </div>

                                <button type="submit" className="contacts__button">
                                    <span className="contacts__button-text">{t('contactSend')}</span>
                                    <div className="contacts__button-arrow"></div>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ContactsSection;