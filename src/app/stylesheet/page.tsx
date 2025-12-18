import styles from './stylesheet.module.css';

export default function StylesheetPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Stylesheet</h1>

      {/* Colors */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Colors</h2>
        <div className={styles.colorGrid}>
          <div className={styles.colorCard}>
            <div className={styles.colorSwatch} style={{ background: 'var(--color-white)', border: '1px solid var(--color-light)' }}></div>
            <span className={styles.colorName}>--color-white</span>
            <span className={styles.colorValue}>#ffffff</span>
          </div>
          <div className={styles.colorCard}>
            <div className={styles.colorSwatch} style={{ background: 'var(--color-black)' }}></div>
            <span className={styles.colorName}>--color-black</span>
            <span className={styles.colorValue}>#000000</span>
          </div>
          <div className={styles.colorCard}>
            <div className={styles.colorSwatch} style={{ background: 'var(--color-dark)' }}></div>
            <span className={styles.colorName}>--color-dark</span>
            <span className={styles.colorValue}>#272727</span>
          </div>
          <div className={styles.colorCard}>
            <div className={styles.colorSwatch} style={{ background: 'var(--color-gray)' }}></div>
            <span className={styles.colorName}>--color-gray</span>
            <span className={styles.colorValue}>#B0B0B0</span>
          </div>
          <div className={styles.colorCard}>
            <div className={styles.colorSwatch} style={{ background: 'var(--color-light)' }}></div>
            <span className={styles.colorName}>--color-light</span>
            <span className={styles.colorValue}>#E6E6E6</span>
          </div>
          <div className={styles.colorCard}>
            <div className={styles.colorSwatch} style={{ background: 'var(--color-accent)' }}></div>
            <span className={styles.colorName}>--color-accent</span>
            <span className={styles.colorValue}>#9DF032</span>
          </div>
        </div>
      </section>

      {/* Typography - Primary Font */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Typography - Primary (Chaney)</h2>
        <div className={styles.fontShowcase}>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>--font-h1 (6.854em)</span>
            <p className={styles.fontH1}>Heading 1</p>
          </div>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>--font-h2 (4.236em)</span>
            <p className={styles.fontH2}>Heading 2</p>
          </div>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>--font-h3 (2.618em)</span>
            <p className={styles.fontH3}>Heading 3</p>
          </div>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>--font-h4 (1.618em)</span>
            <p className={styles.fontH4}>Heading 4</p>
          </div>
        </div>
      </section>

      {/* Typography - Secondary Font */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Typography - Secondary (Inter)</h2>
        <div className={styles.fontShowcase}>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>--font-par (1em)</span>
            <p className={styles.fontPar}>The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>--font-small (0.618em)</span>
            <p className={styles.fontSmall}>The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
      </section>

      {/* Chaney Variants */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Chaney - Alle Varianten</h2>
        <div className={styles.fontShowcase}>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>&apos;Chaney Regular&apos; - font-weight: 400</span>
            <p className={styles.chaneyRegular}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
            <p className={styles.chaneyRegular}>abcdefghijklmnopqrstuvwxyz</p>
            <p className={styles.chaneyRegular}>0123456789</p>
          </div>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>&apos;Chaney Wide&apos; - font-weight: 500</span>
            <p className={styles.chaneyWide}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
            <p className={styles.chaneyWide}>abcdefghijklmnopqrstuvwxyz</p>
            <p className={styles.chaneyWide}>0123456789</p>
          </div>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>&apos;Chaney Extended&apos; - font-weight: 600</span>
            <p className={styles.chaneyExtended}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
            <p className={styles.chaneyExtended}>abcdefghijklmnopqrstuvwxyz</p>
            <p className={styles.chaneyExtended}>0123456789</p>
          </div>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>&apos;Chaney UltraExtended&apos; - font-weight: 700</span>
            <p className={styles.chaneyUltra}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
            <p className={styles.chaneyUltra}>abcdefghijklmnopqrstuvwxyz</p>
            <p className={styles.chaneyUltra}>0123456789</p>
          </div>
        </div>
      </section>

      {/* Chaney Stylistic Alternates */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Chaney - Stylistic Alternates (A O V W)</h2>
        <div className={styles.fontShowcase}>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>Default (ss00)</span>
            <p className={styles.chaneyDefault}>A O V W a o v w</p>
            <p className={styles.chaneyDefault}>AVOW avow WAVE wave</p>
          </div>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>Stylistic Set 1 (ss01)</span>
            <p className={styles.chaneySs01}>A O V W a o v w</p>
            <p className={styles.chaneySs01}>AVOW avow WAVE wave</p>
          </div>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>Stylistic Set 2 (ss02)</span>
            <p className={styles.chaneySs02}>A O V W a o v w</p>
            <p className={styles.chaneySs02}>AVOW avow WAVE wave</p>
          </div>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>Stylistic Set 3 (ss03)</span>
            <p className={styles.chaneySs03}>A O V W a o v w</p>
            <p className={styles.chaneySs03}>AVOW avow WAVE wave</p>
          </div>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>Stylistic Alternates (salt)</span>
            <p className={styles.chaneySalt}>A O V W a o v w</p>
            <p className={styles.chaneySalt}>AVOW avow WAVE wave</p>
          </div>
        </div>
      </section>

      {/* Font Weights - Inter */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Font Weights - Inter</h2>
        <div className={styles.fontShowcase}>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>Light (300)</span>
            <p className={styles.interLight}>The quick brown fox jumps over the lazy dog.</p>
          </div>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>Regular (400)</span>
            <p className={styles.interRegular}>The quick brown fox jumps over the lazy dog.</p>
          </div>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>Medium (500)</span>
            <p className={styles.interMedium}>The quick brown fox jumps over the lazy dog.</p>
          </div>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>SemiBold (600)</span>
            <p className={styles.interSemiBold}>The quick brown fox jumps over the lazy dog.</p>
          </div>
          <div className={styles.fontItem}>
            <span className={styles.fontLabel}>Bold (700)</span>
            <p className={styles.interBold}>The quick brown fox jumps over the lazy dog.</p>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Buttons</h2>
        <div className={styles.buttonShowcase}>
          <div className={styles.buttonItem}>
            <span className={styles.fontLabel}>.btn (hover voor effect)</span>
            <button className="btn">Inside Nitex</button>
          </div>
          <div className={styles.buttonItem}>
            <span className={styles.fontLabel}>.btn-bar (hover voor effect)</span>
            <a href="#" className="btn-bar">Real Life B2B Shopping</a>
          </div>
          <div className={styles.buttonItem}>
            <span className={styles.fontLabel}>.btn-social (hover voor effect)</span>
            <div className={styles.socialButtons}>
              <a href="#" className="btn-social">Instagram</a>
              <a href="#" className="btn-social">LinkedIn</a>
              <a href="#" className="btn-social">Twitter</a>
            </div>
          </div>
          <div className={styles.buttonItem}>
            <span className={styles.fontLabel}>.btn-icon (hover voor effect)</span>
            <div className={styles.iconButtons}>
              <a href="#" className="btn-icon" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.94 7.88C21.9206 7.0503 21.7652 6.2294 21.48 5.45C21.2283 4.78181 20.8322 4.17742 20.32 3.68C19.8226 3.16776 19.2182 2.77166 18.55 2.52C17.7706 2.23484 16.9497 2.07945 16.12 2.06C15.06 2 14.72 2 12 2C9.28 2 8.94 2 7.88 2.06C7.0503 2.07945 6.2294 2.23484 5.45 2.52C4.78181 2.77166 4.17742 3.16776 3.68 3.68C3.16743 4.17518 2.77418 4.78044 2.53 5.45C2.23616 6.22734 2.07721 7.04915 2.06 7.88C2 8.94 2 9.28 2 12C2 14.72 2 15.06 2.06 16.12C2.07721 16.9508 2.23616 17.7727 2.53 18.55C2.77418 19.2196 3.16743 19.8248 3.68 20.32C4.17742 20.8322 4.78181 21.2283 5.45 21.48C6.2294 21.7652 7.0503 21.9206 7.88 21.94C8.94 22 9.28 22 12 22C14.72 22 15.06 22 16.12 21.94C16.9497 21.9206 17.7706 21.7652 18.55 21.48C19.2134 21.219 19.816 20.8242 20.3201 20.3201C20.8242 19.816 21.219 19.2134 21.48 18.55C21.7652 17.7706 21.9206 16.9497 21.94 16.12C21.94 15.06 22 14.72 22 12C22 9.28 22 8.94 21.94 7.88ZM20.14 16C20.1327 16.6348 20.0178 17.2637 19.8 17.86C19.6327 18.2913 19.3773 18.683 19.0501 19.0101C18.723 19.3373 18.3313 19.5927 17.9 19.76C17.3037 19.9778 16.6748 20.0927 16.04 20.1C15.04 20.15 14.67 20.16 12.04 20.16C9.41 20.16 9.04 20.16 8.04 20.1C7.38073 20.1148 6.72401 20.0132 6.1 19.8C5.66869 19.6327 5.27698 19.3773 4.94985 19.0501C4.62272 18.723 4.36734 18.3313 4.2 17.9C3.97775 17.2911 3.86271 16.6482 3.86 16C3.86 15 3.8 14.63 3.8 12C3.8 9.37 3.8 9 3.86 8C3.86271 7.35178 3.97775 6.70893 4.2 6.1C4.36734 5.66869 4.62272 5.27698 4.94985 4.94985C5.27698 4.62272 5.66869 4.36734 6.1 4.2C6.70893 3.97775 7.35178 3.86271 8 3.86C9 3.86 9.37 3.8 12 3.8C14.63 3.8 15 3.8 16 3.86C16.6348 3.86728 17.2637 3.98225 17.86 4.2C18.2913 4.36734 18.683 4.62272 19.0101 4.94985C19.3373 5.27698 19.5927 5.66869 19.76 6.1C19.9959 6.7065 20.1245 7.34942 20.14 8C20.19 9 20.2 9.37 20.2 12C20.2 14.63 20.19 15 20.14 16Z" fill="currentColor"/>
                  <path d="M12 6.86C10.9834 6.86 9.98964 7.16146 9.14437 7.72625C8.2991 8.29104 7.64029 9.0938 7.25126 10.033C6.86222 10.9722 6.76044 12.0057 6.95876 13.0028C7.15709 13.9998 7.64663 14.9157 8.36547 15.6345C9.08431 16.3534 10.0002 16.8429 10.9972 17.0412C11.9943 17.2396 13.0278 17.1378 13.967 16.7487C14.9062 16.3597 15.709 15.7009 16.2738 14.8556C16.8385 14.0104 17.14 13.0166 17.14 12C17.14 10.6368 16.5985 9.32941 15.6345 8.36547C14.6706 7.40153 13.3632 6.86 12 6.86ZM12 15.33C11.3414 15.33 10.6976 15.1347 10.15 14.7688C9.60234 14.4029 9.17552 13.8828 8.92348 13.2743C8.67144 12.6659 8.6055 11.9963 8.73399 11.3503C8.86247 10.7044 9.17963 10.111 9.64533 9.64533C10.111 9.17963 10.7044 8.86247 11.3503 8.73399C11.9963 8.6055 12.6659 8.67144 13.2743 8.92348C13.8828 9.17552 14.4029 9.60234 14.7688 10.15C15.1347 10.6976 15.33 11.3414 15.33 12C15.33 12.4373 15.2439 12.8703 15.0765 13.2743C14.9092 13.6784 14.6639 14.0454 14.3547 14.3547C14.0454 14.6639 13.6784 14.9092 13.2743 15.0765C12.8703 15.2439 12.4373 15.33 12 15.33Z" fill="currentColor"/>
                  <path d="M17.34 5.46001C17.1027 5.46001 16.8707 5.53039 16.6733 5.66224C16.476 5.7941 16.3222 5.98152 16.2313 6.20079C16.1405 6.42006 16.1168 6.66134 16.1631 6.89411C16.2094 7.12689 16.3236 7.34071 16.4915 7.50853C16.6593 7.67636 16.8731 7.79065 17.1059 7.83695C17.3387 7.88325 17.5799 7.85949 17.7992 7.76866C18.0185 7.67784 18.2059 7.52403 18.3378 7.32669C18.4696 7.12935 18.54 6.89734 18.54 6.66001C18.54 6.34175 18.4136 6.03652 18.1885 5.81148C17.9635 5.58643 17.6583 5.46001 17.34 5.46001Z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="btn-icon" aria-label="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.846 15.041 11.846C13.188 11.846 12.905 13.291 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.288 9.661 14.448 8.711 16.181 8.711C19.782 8.711 20.448 11.081 20.448 14.166V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.368C3.274 4.23 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.23 7.401 5.368C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452Z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="btn-icon" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.833 22V13.2H6.669V9.6H9.833V6.849C9.833 3.726 11.694 2 14.541 2C15.4757 2.01295 16.4082 2.09417 17.331 2.243V5.311H15.76C15.4921 5.27507 15.2196 5.29992 14.9626 5.38371C14.7057 5.4675 14.4709 5.60808 14.2757 5.79502C14.0805 5.98195 13.9299 6.21044 13.8351 6.46354C13.7403 6.71663 13.7037 6.98783 13.728 7.257V9.6H17.185L16.633 13.2H13.733V22H9.833Z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Containers */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Containers</h2>
        <div className={styles.containerShowcase}>
          <div className={styles.containerDemo}>
            <span className={styles.containerLabel}>.container (100%)</span>
            <div className={styles.containerFull}></div>
          </div>
          <div className={styles.containerDemo}>
            <span className={styles.containerLabel}>.container.medium (85%)</span>
            <div className={styles.containerMedium}></div>
          </div>
          <div className={styles.containerDemo}>
            <span className={styles.containerLabel}>.container.small (70%)</span>
            <div className={styles.containerSmall}></div>
          </div>
        </div>
      </section>
    </div>
  );
}
