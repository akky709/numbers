import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Numbers Analytics</h3>
            <p className="footer-description">
              ナンバーズ3・4の当選番号を詳細に分析し、
              データドリブンな洞察を提供する専門サイトです。
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">分析メニュー</h4>
            <ul className="footer-links">
              <li><a href="/numbers3">ナンバーズ3分析</a></li>
              <li><a href="/numbers4">ナンバーズ4分析</a></li>
              <li><a href="/">最新当選番号</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">サイト情報</h4>
            <ul className="footer-links">
              <li><a href="/about">このサイトについて</a></li>
              <li><a href="#privacy">プライバシーポリシー</a></li>
              <li><a href="#terms">利用規約</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">注意事項</h4>
            <p className="footer-note">
              当サイトは宝くじの当選を保証するものではありません。
              投資は自己責任でお願いします。
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Numbers Analytics. All rights reserved.</p>
          <p className="footer-disclaimer">
            ※当サイトは公式サイトではありません
          </p>
        </div>
      </div>
    </footer>
  )
}