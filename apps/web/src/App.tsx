import { Card, CardBody, Container, Heading } from "@chakra-ui/react";
import { useRef } from "react";
import { AccountProvider } from "./components/AccountProvider";
import { ActivityList, ActivityListRef } from "./components/ActivityList";
import { SettingCard } from "./components/SettingCard";

function App() {
  const activityListRef = useRef<ActivityListRef>(null);

  function handleRefreshMyActivity() {
    activityListRef.current?.refeshMyActivity();
  }

  return (
    <>
      <Container
        maxW={1000}
        display="flex"
        flexDirection="column"
        py="10vh"
        gap={8}
      >
        <Card>
          <CardBody>
            <Heading fontWeight="light" size="lg">
              EKT Check-in
            </Heading>
          </CardBody>
        </Card>

        <AccountProvider>
          <SettingCard handleRefresh={handleRefreshMyActivity} />
          <ActivityList ref={activityListRef} />
        </AccountProvider>
      </Container>
    </>
  );
}

export default App;
