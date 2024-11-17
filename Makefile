PROTO_DIR := src/proto

# Cari semua file .proto di bawah PROTO_DIR
PROTO_FILES := $(shell find $(PROTO_DIR) -name '*.proto')

# Protoc installed global
PROTOC := /usr/local/bin/grpc_tools_node_protoc
PROTOC_GEN_TS_PROTO := /usr/local/bin/protoc-gen-ts_proto

# Target default
.PHONY: all
all: proto


.PHONY: proto
proto: $(PROTO_FILES)
	@echo "Compiling .proto to TS..."
	@for file in $(PROTO_FILES); do \
		dir=`dirname $$file`; \
		base=`basename $$file .proto`; \
		echo "Compiling $$file"; \
		$(PROTOC) \
			--proto_path=$(PROTO_DIR) \
			--plugin=protoc-gen-ts_proto=$(PROTOC_GEN_TS_PROTO) \
			--ts_proto_out=./src/proto \
			--ts_proto_opt=esModuleInterop=true,forceLong=long,useOptionals=true,outputServices=grpc-js \
			$$file; \
	done
	@echo "Compilation done."


.PHONY: clean
clean:
	@echo "Clean files..."
	@find $(PROTO_DIR) -type f -name '*.ts' -exec rm -f {} +
	@echo "Bersih!"
