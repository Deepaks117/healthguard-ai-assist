
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import DocumentUpload from '@/components/DocumentUpload';
import TextScanner from '@/components/TextScanner';

const Documents = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#003366] mb-2">Document Analysis</h1>
          <p className="text-gray-600">
            Upload documents or scan text for HIPAA and GDPR compliance issues
          </p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">File Upload</TabsTrigger>
            <TabsTrigger value="text">Text Scanner</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <DocumentUpload />
          </TabsContent>
          
          <TabsContent value="text">
            <TextScanner />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Documents;
