import * as React from 'react';

interface EmailTemplateProps {
  senderName: string;
  capsuleUrl: string;
  title: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  senderName,
  capsuleUrl,
  title,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
    <h1>🕰️ You have a Time Capsule!</h1>
    <p>Hello,</p>
    <p>
      <strong>{senderName}</strong> created a time capsule for you a while ago, 
      and it has finally unlocked <strong>today</strong>.
    </p>
    
    <div style={{ margin: '20px 0', padding: '15px', borderLeft: '4px solid #7c3aed', backgroundColor: '#f3f4f6' }}>
      <strong>Capsule Title:</strong> {title}
    </div>

    <p>The wait is over. You can now read the message:</p>
    
    <a 
      href={capsuleUrl} 
      style={{
        backgroundColor: '#000', 
        color: '#fff', 
        padding: '12px 24px', 
        borderRadius: '5px', 
        textDecoration: 'none',
        fontWeight: 'bold',
        display: 'inline-block',
        marginTop: '10px'
      }}
    >
      View Capsule
    </a>
    
    <p style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
      Sent via GhostPost Time Vault
    </p>
  </div>
);