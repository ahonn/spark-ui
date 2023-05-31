import React, { useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Button from '@/components/common/button';
import Navigation from '@/components/common/navigation';
import navs from '@/navs';
import { Container, Flex, Spacer } from '@chakra-ui/react';
import { useConnect, useDisconnect } from '@spinal-ckb/react';
import { StakeRoleType, useStakeRole } from '@/hooks/useStakeRole';

export interface IHeaderProps {
  logoOnly?: boolean;
}

export default function Header(props: IHeaderProps) {
  const router = useRouter();
  const { connect, connected, address } = useConnect({});
  const { role } = useStakeRole();
  const { disconnect } = useDisconnect();

  const navsByRole = useMemo(() => {
    if (role === StakeRoleType.Delegator) {
      return navs.filter(({ name }) => name !== 'Stake');
    }
    return navs;
  }, [role]);

  const active = React.useMemo(() => {
    const nav = navs.find(({ href }) => router.pathname.startsWith(href));
    return nav?.name;
  }, [router.pathname]);

  return (
    <header>
      <Container maxW="1440px">
        <Flex height="84px" backgroundColor="transparent" alignItems="center">
          <Image src="/img/logo.webp" alt="spark" width={135} height={70} />
          <Spacer />
          {!props.logoOnly && (
            <>
              <Navigation navs={navsByRole} active={active} />
              <Spacer />
              {connected ? (
                <Button
                  width="50"
                  variant="outlined"
                  onClick={() => disconnect()}
                >
                  {address?.slice(0, 6) + '..' + address?.slice(-7)}
                </Button>
              ) : (
                <Button width="50" onClick={() => connect()}>
                  Connect Wallet
                </Button>
              )}
            </>
          )}
        </Flex>
      </Container>
    </header>
  );
}
