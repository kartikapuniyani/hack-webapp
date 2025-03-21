import React from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
`;

const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`;

const NotificationCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: ${(props) => props.theme.spacing.md};
  display: flex;
  align-items: flex-start;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
`;

const NotificationIcon = styled.div<{
  $type: "pothole" | "speedBreaker" | "system";
}>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => {
    switch (props.$type) {
      case "pothole":
        return props.theme.colors.pothole;
      case "speedBreaker":
        return props.theme.colors.speedBreaker;
      case "system":
        return props.theme.colors.primary;
    }
  }};
  color: white;
  font-size: 1.2rem;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.h3`
  margin: 0 0 ${(props) => props.theme.spacing.xs} 0;
  font-size: 1rem;
`;

const NotificationMessage = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

const NotificationTimestamp = styled.div`
  color: #999;
  font-size: 0.8rem;
  margin-top: ${(props) => props.theme.spacing.xs};
`;

// Mock notification data
const notifications = [
  {
    id: "1",
    type: "pothole" as const,
    title: "New Pothole Reported",
    message: "A new pothole has been reported near Broadway and 5th Ave.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
  {
    id: "2",
    type: "speedBreaker" as const,
    title: "Speed Breaker Confirmed",
    message:
      "The speed breaker on 42nd Street has been confirmed by 5 other users.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: true,
  },
  {
    id: "3",
    type: "system" as const,
    title: "Welcome to RoadSense",
    message:
      "Thanks for joining! Start reporting road issues in your area to help other drivers.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
];

const NotificationsPage: React.FC = () => {
  return (
    <Container>
      <NotificationsList>
        {notifications.map((notification) => (
          <NotificationCard key={notification.id}>
            <NotificationIcon $type={notification.type}>
              {notification.type === "pothole"
                ? "🕳️"
                : notification.type === "speedBreaker"
                ? "⚠️"
                : "🔔"}
            </NotificationIcon>

            <NotificationContent>
              <NotificationTitle>{notification.title}</NotificationTitle>
              <NotificationMessage>{notification.message}</NotificationMessage>
              <NotificationTimestamp>
                {notification.timestamp.toLocaleString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                  day: "numeric",
                  month: "short",
                })}
              </NotificationTimestamp>
            </NotificationContent>
          </NotificationCard>
        ))}
      </NotificationsList>
    </Container>
  );
};

export default NotificationsPage;
