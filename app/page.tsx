import Header from "@/components/Header"
import Footer from "@/components/Footer"
import SkinAnalyzerApp from "@/components/SkinAnalyzerApp"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <SkinAnalyzerApp />
      </div>
      <Footer />
    </main>
  )
}

