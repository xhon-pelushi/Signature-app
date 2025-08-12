"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Download, PenTool, Type, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function SignPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <PenTool className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SignatureApp</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                Save Draft
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Send for Signature
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Upload/Viewer */}
          <div className="lg:col-span-2">
            {!uploadedFile ? (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload PDF Document
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your PDF file here, or click to browse
                </p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Choose File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">{uploadedFile.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800 text-sm"
                        onClick={() => setUploadedFile(null)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* PDF Viewer Placeholder */}
                <div className="p-6 h-[600px] bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">PDF Viewer</p>
                    <p className="text-gray-500 text-sm">
                      PDF rendering will be implemented with react-pdf
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Signature Tools */}
          <div className="space-y-6">
            {/* Signature Creation */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Signature</h3>
              
              {/* Signature Mode Tabs */}
              <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
                <button
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    signatureMode === 'draw' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setSignatureMode('draw')}
                >
                  <PenTool className="h-4 w-4 mr-1" />
                  Draw
                </button>
                <button
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    signatureMode === 'type' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setSignatureMode('type')}
                >
                  <Type className="h-4 w-4 mr-1" />
                  Type
                </button>
                <button
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    signatureMode === 'upload' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setSignatureMode('upload')}
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Upload
                </button>
              </div>

              {/* Signature Canvas/Input */}
              <div className="border border-gray-300 rounded-lg h-32 bg-gray-50 flex items-center justify-center mb-4">
                {signatureMode === 'draw' && (
                  <p className="text-gray-500 text-sm">Signature canvas will be here</p>
                )}
                {signatureMode === 'type' && (
                  <input
                    type="text"
                    placeholder="Type your name"
                    className="border-none bg-transparent text-2xl font-cursive text-center w-full outline-none"
                    style={{ fontFamily: 'cursive' }}
                  />
                )}
                {signatureMode === 'upload' && (
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Upload signature image</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Save Signature
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                  Clear
                </button>
              </div>
            </div>

            {/* Field Tools */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Fields</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center">
                  <PenTool className="h-4 w-4 text-blue-600 mr-3" />
                  Signature Field
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center">
                  <Type className="h-4 w-4 text-green-600 mr-3" />
                  Text Field
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center">
                  <div className="h-4 w-4 border border-purple-600 rounded mr-3"></div>
                  Checkbox
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center">
                  <div className="h-4 w-4 bg-orange-600 rounded mr-3"></div>
                  Date Field
                </button>
              </div>
            </div>

            {/* Document Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                  Preview Document
                </button>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Send for Signature
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                  Save as Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
