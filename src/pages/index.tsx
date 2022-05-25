import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Deoxys</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen mx-auto bg-black">
        <h1 className="text-6xl font-bold text-gray-100 uppercase">deoxys</h1>
      </div>
    </>
  );
};

export default Home;
