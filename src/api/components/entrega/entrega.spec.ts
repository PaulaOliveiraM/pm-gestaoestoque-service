import {  expect } from "chai";
import { TestFactory } from "../../../test/factory";
import { Entrega, EntregaStatus } from "../../../entity/Entrega";
import { Armazem } from "../../../entity/Armazem";
import { Cliente } from "../../../entity/Cliente";
import { BaixaEntrega } from "./entrega.model";

describe("Testando o componente Entrega", () => {
  const factory: TestFactory = new TestFactory();
  const entregaFake: Entrega = {
    armazem: new Armazem(1),
    cliente: new Cliente(1),
    enderecoDestinatario: "Rua dos testes",
    nomeDestinatario: "Destinatário de Teste",
    idPedido: 12,
  };
  before((done) => {
    factory.init().then(done);
  });

  after((done) => {
    factory.close().then(done);
  });

  describe("POST entrega/entrada", () => {
    it("responde com o status 200 e dados adicionais sobre a entrega iniciada", (done) => {
      factory.app
        .post("/api/v1/entrega/entrada")
        .send(entregaFake)
        .set("Content-Type", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          const entregaRetornada: Entrega = res.body;
          expect(entregaRetornada.id).eq(1);
          expect(entregaRetornada.dataPrevistaEntrega).not.be.undefined;
          expect(entregaRetornada.status).eq(EntregaStatus.Iniciada);

          return done();
        });
    });

    it("responde com o status 500 caso o cliente informado não seja encontrado", (done) => {
      const entregaWithWrongClientIdFake = JSON.parse(
        JSON.stringify(entregaFake)
      );

      entregaWithWrongClientIdFake.cliente.id = 789789798;
      factory.app
        .post("/api/v1/entrega/entrada")
        .send(entregaWithWrongClientIdFake)
        .set("Content-Type", "application/json")
        .expect("Content-Type", /json/)
        .expect(500, done);
    });

    it("responde com o status 500 caso o armazém informado não seja encontrado", (done) => {
      const entregaWithWrongArmazemIdFake = JSON.parse(
        JSON.stringify(entregaFake)
      );

      entregaWithWrongArmazemIdFake.armazem.id = 789789798;
      factory.app
        .post("/api/v1/entrega/entrada")
        .send(entregaWithWrongArmazemIdFake)
        .set("Content-Type", "application/json")
        .expect("Content-Type", /json/)
        .expect(500, done);
    });

    it("responde com o status 400 caso o produto da entrega não seja informado", (done) => {
      const entregaSemProdutoFake = JSON.parse(JSON.stringify(entregaFake));

      entregaSemProdutoFake.produto = "";

      factory.app
        .post("/api/v1/entrega/entrada")
        .send(entregaSemProdutoFake)
        .set("Content-Type", "application/json")
        .expect("Content-Type", "text/html; charset=utf-8")
        .expect(400, done);
    });
  });

  describe("POST entrega/saida", () => {
    it("responde com o status 200 quando a saída de uma entrega é realizada", (done) => {
      const entrega = JSON.parse(JSON.stringify(entregaFake));

      // insere a entrega
      factory.app
        .post("/api/v1/entrega/entrada")
        .send(entrega)
        .set("Content-Type", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          const entregaRetornada: Entrega = res.body;

          const baixaEntregaFake: BaixaEntrega = {
            codigoEntrega: entregaRetornada.id,
            latitude: 1,
            longitude: 2,
            observacao: "Teste observação baixa entrega",
            usuario: "entregador",
          };

          factory.app
            .post("/api/v1/entrega/baixa")
            .send(baixaEntregaFake)
            .set("Content-Type", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
              const entregaRetornada: Entrega = res.body;
              expect(entregaRetornada.status).eq(EntregaStatus.Concluida);
              expect(entregaRetornada.dataEntrega).not.null;
              return done();
            });
        });
    });

    it("responde com o status 404 quando uma entrega não é localizada", (done) => {
      const baixaEntregaFake: BaixaEntrega = {
        codigoEntrega: 1121212,
        latitude: 1,
        longitude: 2,
        observacao: "Teste observação baixa entrega",
        usuario: "entregador",
      };
      factory.app
        .post("/api/v1/entrega/baixa")
        .send(baixaEntregaFake)
        .set("Content-Type", "application/json")
        .expect("Content-Type", "text/html; charset=utf-8")
        .expect(404)
        .end((err, res) => {
          expect(res.text).eq("Entrega não localizada");
          return done();
        });
    });

    it("responde com o status 400 quando uma entrega já foi baixada", (done) => {
      const entrega = JSON.parse(JSON.stringify(entregaFake));

      // insere a entrega
      factory.app
        .post("/api/v1/entrega/entrada")
        .send(entrega)
        .set("Content-Type", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          const entregaRetornada: Entrega = res.body;

          const baixaEntregaFake: BaixaEntrega = {
            codigoEntrega: entregaRetornada.id,
            latitude: 1,
            longitude: 2,
            observacao: "Teste observação baixa entrega",
            usuario: "entregador",
          };

          factory.app
            .post("/api/v1/entrega/baixa")
            .send(baixaEntregaFake)
            .set("Content-Type", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
              const entregaRetornada: Entrega = res.body;
              expect(entregaRetornada.status).eq(EntregaStatus.Concluida);
              expect(entregaRetornada.dataEntrega).not.null;
              factory.app
                .post("/api/v1/entrega/baixa")
                .send(baixaEntregaFake)
                .set("Content-Type", "application/json")
                .expect("Content-Type", "text/html; charset=utf-8")
                .expect(400,done);
            });
        });
    });
  });

  describe("GET entrega/:codigoEntrega", () => {
    it("responde com o status 200 e retorna os dados da entrega localizada", (done) => {
      // insere a entrega
      factory.app
        .post("/api/v1/entrega/entrada")
        .send(entregaFake)
        .set("Content-Type", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          const entregaRetornada: Entrega = res.body;
          entregaFake.id = entregaRetornada.id;
          entregaFake.dataPrevistaEntrega =
            entregaRetornada.dataPrevistaEntrega;
          entregaFake.status = entregaRetornada.status;

          // consulta a entrega
          factory.app
            .get(`/api/v1/entrega/${entregaFake.id}`)
            .expect("Content-Type", /json/)
            .expect(200, done);
        });
    });

    it("responde com o status 404 quando uma entrega não é localizada", (done) => {
      // consulta a entrega
      factory.app
        .get("/api/v1/entrega/4654654")
        .expect("Content-Type", "text/html; charset=utf-8")
        .expect(404, done);
    });
  });
});
