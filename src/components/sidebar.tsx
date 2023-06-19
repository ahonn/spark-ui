import { Box, Flex, Link, Spacer } from '@chakra-ui/react';
import Image from 'next/image';
import Navigation from './common/navigation';
import { useRouter } from 'next/router';
import { useConnect } from '@/hooks/useConnect';
import { StakeRoleType, useStakeRole } from '@/hooks/useStakeRole';
import { forwardRef, useEffect, useMemo, useState } from 'react';

const NAVS = [
  {
    name: 'Stake',
    href: '/stake',
  },
  {
    name: 'Delegate',
    href: '/delegate',
  },
  {
    name: 'Rewards',
    href: '/rewards',
  },
  {
    name: 'Explorer',
    href: '/explorer',
  },
];

const Sidebar: React.ForwardRefRenderFunction<HTMLDivElement, {}> = (_, ref) => {
  const router = useRouter();
  const { isConnected } = useConnect();
  const { role } = useStakeRole();
  const [navs, setNavs] = useState(() => {
    let finalNavs = NAVS;
    if (role === StakeRoleType.Delegator) {
      finalNavs = finalNavs.filter(({ name }) => name !== 'Stake');
    }
    if (!isConnected) {
      finalNavs = finalNavs.filter(({ name }) => name !== 'Rewards');
    }
    return finalNavs;
  })

  useEffect(() => {
    if (isConnected) {
      setNavs(NAVS);
    }
  }, [role, isConnected]);

  const active = useMemo(() => {
    const nav = navs.find(({ href }) => router.pathname.startsWith(href));
    return nav?.name;
  }, [router.pathname, navs]);

  return (
    <Box height="100vh" minWidth="200px" maxWidth="240px" ref={ref}>
      <Flex
        direction="column"
        alignItems="center"
        height="full"
        borderRightColor="yellow.800"
        borderRightWidth="1px"
        paddingY={10}
      >
        <Box marginBottom="90px">
          <Image src="/img/logo.webp" alt="spark" width={135} height={70} />
        </Box>
        <Navigation direction="column" navs={navs} active={active} />
        <Spacer />
        <Box marginBottom="20px">
          <Link
            href="/?redirect=false"
            fontFamily="alfarn-2"
            fontSize="lg"
            fontWeight="bold"
            _hover={{ textDecoration: 'none' }}
          >
            Switch Role
          </Link>
        </Box>
      </Flex>
    </Box>
  );
}

export default forwardRef(Sidebar);
