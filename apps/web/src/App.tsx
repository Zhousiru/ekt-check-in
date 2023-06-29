import { Card, CardBody, Container, Heading } from "@chakra-ui/react";
import { AccountProvider } from "./components/AccountProvider";
import { ActivityList } from "./components/ActivityList";
import { SettingCard } from "./components/SettingCard";

function App() {
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
          <SettingCard />
          <ActivityList />
        </AccountProvider>
      </Container>
    </>
  );
}

export default App;
