import React from 'react';
import { Link } from 'react-router-dom';
import LatestResults from '../components/LatestResults';
import QuickStats from '../components/QuickStats';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      {/* ヒーローセクション */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              ナンバーズ分析の
              <span className="text-gradient">新しいスタンダード</span>
            </h1>
            <p className="hero-description">
              過去の当選データを詳細に分析し、パターンや傾向を可視化。
              データドリブンなアプローチで宝くじの世界を探求しましょう。
            </p>
            <div className="hero-actions">
              <Link to="/numbers4" className="btn btn-primary">
                ナンバーズ4を分析
              </Link>
              <Link to="/numbers3" className="btn btn-outline">
                ナンバーズ3を分析
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="numbers-display">
              <div className="number-card">
                <span className="number">7</span>
              </div>
              <div className="number-card">
                <span className="number">3</span>
              </div>
              <div className="number-card">
                <span className="number">9</span>
              </div>
              <div className="number-card">
                <span className="number">2</span>
              </div>
            </div>
            <div className="chart-visual">
              <div className="chart-bar" style={{height: '60%'}}></div>
              <div className="chart-bar" style={{height: '80%'}}></div>
              <div className="chart-bar" style={{height: '45%'}}></div>
              <div className="chart-bar" style={{height: '90%'}}></div>
              <div className="chart-bar" style={{height: '70%'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* 最新結果セクション */}
      <section className="latest-section">
        <div className="container">
          <h2 className="section-title">最新の当選番号</h2>
          <LatestResults />
        </div>
      </section>

      {/* クイック統計セクション */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">データ概要</h2>
          <QuickStats />
        </div>
      </section>

      {/* 機能紹介セクション */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">分析機能</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>トレンド分析</h3>
              <p>過去の当選番号から傾向とパターンを分析し、視覚的に表示します。</p>
              <Link to="/numbers4" className="feature-link">詳しく見る →</Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔥</div>
              <h3>ホット・コールド数字</h3>
              <p>よく出る数字（ホット）と出にくい数字（コールド）を特定します。</p>
              <Link to="/numbers3" className="feature-link">詳しく見る →</Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>統計ダッシュボード</h3>
              <p>各桁の出現頻度や組み合わせパターンを詳細に分析します。</p>
              <Link to="/numbers4" className="feature-link">詳しく見る →</Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>予測支援</h3>
              <p>過去のデータに基づいた統計的な予測支援機能を提供します。</p>
              <Link to="/numbers3" className="feature-link">詳しく見る →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>今すぐ分析を始めましょう</h2>
            <p>過去の当選データを見て、あなたなりの戦略を立ててみませんか？</p>
            <div className="cta-actions">
              <Link to="/numbers4" className="btn btn-primary">
                過去の当選番号を見る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;